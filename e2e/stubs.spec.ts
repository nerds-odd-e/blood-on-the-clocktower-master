import { test, expect } from '@playwright/test'

test.describe('stub routes', () => {
  test('/setup shows Trouble Brewing confirmation and Back to home', async ({
    page,
  }) => {
    await page.goto('/setup')
    await expect(
      page.getByRole('heading', { name: 'Trouble Brewing' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Continue setup' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
  })

  test('/play shows Play and Back to home returns to /', async ({ page }) => {
    await page.goto('/play')
    await expect(page.getByRole('heading', { name: 'Play' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to home' }).click()
    await expect(page).toHaveURL(/\/?$/)
  })
})
