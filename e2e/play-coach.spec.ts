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

async function reachNightReadyWithSevenPlayers(page: Page) {
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
}

test.describe('play coach first night', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Start first night → Next → More detail → Demon bluffs path for 7 players', async ({
    page,
  }) => {
    await reachNightReadyWithSevenPlayers(page)

    await page.getByRole('button', { name: 'Start first night' }).click()
    await expect(page).toHaveURL(/\/play/)

    await expect(page.getByText(/First night · step/i)).toBeVisible()
    await expect(page.getByRole('heading').first()).toBeVisible()

    const shortBefore = await page.locator('main').innerText()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText(/First night · step/i)).toBeVisible()
    const shortAfter = await page.locator('main').innerText()
    expect(shortAfter).not.toEqual(shortBefore)

    await page.getByRole('button', { name: 'More detail' }).click()
    await expect(page.getByRole('button', { name: 'Less detail' })).toBeVisible()

    // Advance until Demon Info (or fail if coach never surfaces it)
    for (let i = 0; i < 40; i += 1) {
      if (await page.getByRole('heading', { name: 'Demon Info' }).isVisible()) {
        break
      }
      await page.getByRole('button', { name: 'Next' }).click()
    }
    await expect(page.getByRole('heading', { name: 'Demon Info' })).toBeVisible()
    await expect(page.getByText('Demon bluffs')).toBeVisible()

    const bluffChips = page.getByTestId('bluff-chip')
    await expect(bluffChips.first()).toBeVisible()
    await bluffChips.nth(0).click()
    await bluffChips.nth(1).click()
    // Soft-confirm path when leaving with fewer than 3
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(
      page.getByRole('dialog', { name: 'Bluffs incomplete' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Continue anyway' }),
    ).toBeVisible()
  })
})
