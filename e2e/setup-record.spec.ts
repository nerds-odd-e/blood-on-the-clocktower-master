import { expect, test, type Page } from '@playwright/test'

const PLAYER_NAMES = ['Alice', 'Ben', 'Clara', 'Diego', 'Evelyn']

async function reachRecordStep(page: Page) {
  await page.goto('/setup')
  await page.getByRole('button', { name: 'Continue setup' }).click()

  for (const [index, name] of PLAYER_NAMES.entries()) {
    await page.getByRole('button', { name: 'Add player' }).click()
    await page.getByLabel(`Player ${index + 1} name`).fill(name)
  }

  await page.getByRole('button', { name: 'Next step' }).click()
  await page.getByRole('button', { name: 'Next step' }).click()
  await page.getByRole('button', { name: 'Accept bag' }).click()
  await page.getByRole('button', { name: 'Continue to record' }).click()
  await expect(page.getByRole('heading', { name: 'Record roles' })).toBeVisible()
}

async function assignEveryBagToken(page: Page) {
  const rows = page.getByTestId('setup-player-row')
  for (let index = 0; index < PLAYER_NAMES.length; index += 1) {
    await rows.nth(index).click()
    await page.getByTestId('setup-role-chip').first().click()
  }
}

test.describe('setup record roles', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows selected player outline affordance and named picker heading', async ({
    page,
  }) => {
    await reachRecordStep(page)

    const rows = page.getByTestId('setup-player-row')
    const first = rows.first()
    await first.click()

    await expect(first).toHaveAttribute('aria-pressed', 'true')
    await expect(
      page.getByRole('heading', { name: 'Pick character for Alice' }),
    ).toBeVisible()

    await page.getByTestId('setup-role-chip').first().click()

    await expect(first).toHaveAttribute('aria-pressed', 'false')
    await expect(
      page.getByRole('heading', { name: /Pick character for/ }),
    ).toHaveCount(0)
  })

  test('assigns only remaining bag roles and Clear role restores a chip', async ({
    page,
  }) => {
    await reachRecordStep(page)

    const rows = page.getByTestId('setup-player-row')
    await expect(rows).toHaveCount(PLAYER_NAMES.length)

    for (let index = 0; index < PLAYER_NAMES.length; index += 1) {
      const row = rows.nth(index)
      await row.click()
      const chip = page.getByTestId('setup-role-chip').first()
      const roleName = (await chip.textContent())?.trim()
      await chip.click()
      await expect(row).toContainText(roleName ?? '')
      await expect(row).not.toContainText('Not recorded yet')
    }

    await rows.first().click()
    const clearedRoleId = await rows.first().getAttribute('data-role-id')
    await page.getByRole('button', { name: 'Clear role' }).click()
    await expect(rows.first()).toContainText('Not recorded yet')

    await rows.first().click()
    await expect(
      page.locator(
        `[data-testid="setup-role-chip"][data-role-id="${clearedRoleId}"]`,
      ),
    ).toHaveCount(1)
  })

  test('lists incomplete recording issues before Start anyway reaches Night ready', async ({
    page,
  }) => {
    await reachRecordStep(page)

    await page.getByRole('button', { name: 'Start night' }).click()
    const dialog = page.getByRole('dialog', {
      name: 'Recording is incomplete',
    })
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Alice has no character yet.')
    await expect(dialog).toContainText('Recorded roles do not match the bag')
    await expect(page).toHaveURL(/\/setup$/)

    await dialog.getByRole('button', { name: 'Keep recording' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(
      page.getByRole('heading', { name: 'Record roles' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Start night' }).click()
    await page.getByRole('button', { name: 'Start anyway' }).click()
    await expect(
      page.getByRole('heading', { name: 'Night ready' }),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/setup$/)
    await expect(
      page.getByRole('button', { name: 'Start first night' }),
    ).toBeVisible()
  })


  test('a complete recording reaches Night ready without an override', async ({
    page,
  }) => {
    await reachRecordStep(page)
    await assignEveryBagToken(page)

    await page.getByRole('button', { name: 'Start night' }).click()

    await expect(
      page.getByRole('heading', { name: 'Night ready' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Recording is incomplete' }),
    ).toHaveCount(0)
    await expect(page).toHaveURL(/\/setup$/)
    await expect(page.getByText('Players')).toBeVisible()
    await expect(page.getByText('Difficulty')).toBeVisible()
    await expect(page.getByText('Bag', { exact: true })).toBeVisible()
    await expect(page.getByText('Assignments', { exact: true })).toBeVisible()
    await expect(page.getByText('Assignments are saved')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Start first night' }),
    ).toBeVisible()
  })


  test('withholds saved assurance when the critical IndexedDB write fails, then retries', async ({
    page,
  }) => {
    await reachRecordStep(page)
    await assignEveryBagToken(page)

    await page.evaluate(() => {
      ;(window as Window & { __ST_FAIL_IDB_WRITES?: boolean }).__ST_FAIL_IDB_WRITES =
        true
    })

    await page.getByRole('button', { name: 'Start night' }).click()
    await expect(
      page.getByRole('heading', { name: 'Night ready' }),
    ).toBeVisible()
    await expect(page.getByText('Assignments are saved')).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: 'Retry' }),
    ).toBeVisible()

    await page.evaluate(() => {
      ;(window as Window & { __ST_FAIL_IDB_WRITES?: boolean }).__ST_FAIL_IDB_WRITES =
        false
    })
    await page.getByRole('button', { name: 'Retry' }).click()
    await expect(page.getByText('Assignments are saved')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Retry' })).toHaveCount(0)
  })

  test('restores focus to Start night after soft-gate Keep recording', async ({
    page,
  }) => {
    await reachRecordStep(page)

    const startNight = page.getByRole('button', { name: 'Start night' })
    await startNight.click()
    const dialog = page.getByRole('dialog', {
      name: 'Recording is incomplete',
    })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Keep recording' }).click()
    await expect(dialog).toHaveCount(0)

    await expect(startNight).toBeFocused()
  })
})
