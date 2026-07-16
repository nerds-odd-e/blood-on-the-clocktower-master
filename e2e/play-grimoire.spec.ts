import { expect, test, type Page } from '@playwright/test'

const SEVEN_PLAYERS = [
  'Alice',
  'Ben',
  'Clara',
  'Diego',
  'Evelyn',
  'Farah',
  'Gus',
]

async function reachFirstNightCoach(page: Page) {
  await page.goto('/setup')
  await page.getByRole('button', { name: 'Continue setup' }).click()

  for (const [index, name] of SEVEN_PLAYERS.entries()) {
    await page.getByRole('button', { name: 'Add player' }).click()
    await page.getByLabel(`Player ${index + 1} name`).fill(name)
  }

  await page.getByRole('button', { name: 'Next step' }).click()
  await page.getByRole('button', { name: 'Next step' }).click()
  await page.getByRole('button', { name: 'Accept bag' }).click()
  await page.getByRole('button', { name: 'Continue to record' }).click()
  await expect(page.getByRole('heading', { name: 'Record roles' })).toBeVisible()

  const rows = page.getByTestId('setup-player-row')
  for (let index = 0; index < SEVEN_PLAYERS.length; index += 1) {
    await rows.nth(index).click()
    await page.getByTestId('setup-role-chip').first().click()
  }

  await page.getByRole('button', { name: 'Start night' }).click()
  await expect(page.getByRole('heading', { name: 'Night ready' })).toBeVisible()
  await page.getByRole('button', { name: 'Start first night' }).click()
  await expect(page).toHaveURL(/\/play/)
  await expect(page.getByText(/First night · step/i)).toBeVisible()
}

test.describe('play live grimoire and other night bridge', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Grimoire Dead/Alive + reminder place/clear + Night complete → Start other night', async ({
    page,
  }) => {
    await reachFirstNightCoach(page)

    await page.getByRole('button', { name: 'Grimoire' }).click()
    await expect(page.getByRole('heading', { name: 'Grimoire' })).toBeVisible()

    const firstRow = page.getByTestId('grimoire-player-row').first()
    await expect(firstRow).toBeVisible()

    await firstRow.getByRole('button', { name: 'Dead' }).click()
    await expect(firstRow).toHaveAttribute('data-dead', 'true')
    await expect(firstRow.getByText('Dead', { exact: true }).first()).toBeVisible()

    await firstRow.getByRole('button', { name: 'Alive' }).click()
    await expect(firstRow).toHaveAttribute('data-dead', 'false')

    // Prefer a seated role that has catalog reminder tokens.
    const rows = page.getByTestId('grimoire-player-row')
    const rowCount = await rows.count()
    let reminderRow = firstRow
    let reminderLabel = ''
    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index)
      await row.getByRole('button', { name: 'Add reminder' }).click()
      const chip = page.getByTestId('reminder-chip').first()
      if (await chip.isVisible().catch(() => false)) {
        reminderRow = row
        reminderLabel = (await chip.textContent())?.trim() ?? ''
        await chip.click()
        break
      }
    }
    expect(reminderLabel.length).toBeGreaterThan(0)
    await expect(reminderRow.getByText(reminderLabel, { exact: true })).toBeVisible()

    // Clear by tapping the placed chip on the row (not the picker chip).
    await reminderRow
      .locator('button', { hasText: reminderLabel })
      .first()
      .click()
    await expect(
      reminderRow.locator('button', { hasText: reminderLabel }),
    ).toHaveCount(0)

    await page.getByRole('button', { name: 'Back to coach' }).click()
    await expect(page.getByText(/First night · step/i)).toBeVisible()

    for (let i = 0; i < 60; i += 1) {
      if (
        await page.getByRole('heading', { name: 'Night complete' }).isVisible()
      ) {
        break
      }
      const next = page.getByRole('button', { name: 'Next' })
      if (await next.isVisible()) {
        await next.click()
        const continueAnyway = page.getByRole('button', {
          name: 'Continue anyway',
        })
        if (await continueAnyway.isVisible()) {
          await continueAnyway.click()
        }
      }
    }

    await expect(
      page.getByRole('heading', { name: 'Night complete' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Start other night' }).click()
    await expect(page.getByText(/Other night · step/i)).toBeVisible()
  })
})
