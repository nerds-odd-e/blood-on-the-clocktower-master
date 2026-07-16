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

test.describe('setup record roles', () => {
  test.use({ viewport: { width: 390, height: 844 } })

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
      page.getByTestId('setup-role-chip').filter({
        has: page.locator(`[data-role-id="${clearedRoleId}"]`),
      }),
    ).toHaveCount(1)
  })
})
