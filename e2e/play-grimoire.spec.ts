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

    await page.getByRole('link', { name: 'Grimoire' }).click()
    await expect(page.getByRole('heading', { name: 'Grimoire' })).toBeVisible()

    const firstRow = page.getByTestId('grimoire-player-row').first()
    await expect(firstRow).toBeVisible()

    const deadToggle = firstRow.getByRole('button', { name: 'Dead' })
    await deadToggle.click()
    await expect(firstRow.getByText('Dead', { exact: true })).toBeVisible()

    const aliveToggle = firstRow.getByRole('button', { name: 'Alive' })
    await aliveToggle.click()
    await expect(firstRow.getByText('Dead', { exact: true })).toHaveCount(0)

    await firstRow.getByRole('button', { name: 'Add reminder' }).click()
    const reminderChip = page.getByTestId('reminder-chip').first()
    await expect(reminderChip).toBeVisible()
    const reminderLabel = (await reminderChip.textContent())?.trim() ?? ''
    await reminderChip.click()
    await expect(firstRow.getByText(reminderLabel)).toBeVisible()

    // Clear by tapping the placed chip
    await firstRow.getByText(reminderLabel).click()
    await expect(firstRow.getByText(reminderLabel)).toHaveCount(0)

    await page.getByRole('link', { name: 'Back to coach' }).click()
    await expect(page.getByText(/First night · step/i)).toBeVisible()

    for (let i = 0; i < 60; i += 1) {
      if (await page.getByRole('heading', { name: 'Night complete' }).isVisible()) {
        break
      }
      const next = page.getByRole('button', { name: 'Next' })
      if (await next.isVisible()) {
        await next.click()
        // Soft-confirm bluffs if dialog appears
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
