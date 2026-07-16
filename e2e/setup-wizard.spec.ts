import { expect, test } from '@playwright/test'

test.describe('setup wizard roster', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('continues from Trouble Brewing through five players to Difficulty', async ({
    page,
  }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Start setup' })
      .or(page.getByRole('button', { name: 'Start setup' }))
      .click()

    await expect(page).toHaveURL(/\/setup/)
    await expect(
      page.getByRole('heading', { name: 'Trouble Brewing' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue setup' }).click()

    for (const [index, name] of [
      'Alice',
      'Ben',
      'Clara',
      'Diego',
      'Evelyn',
    ].entries()) {
      await page.getByRole('button', { name: 'Add player' }).click()
      await page.getByLabel(`Player ${index + 1} name`).fill(name)
    }

    await page.getByRole('button', { name: 'Next step' }).click()
    await expect(page.getByRole('heading', { name: 'Difficulty' })).toBeVisible()
  })
})
