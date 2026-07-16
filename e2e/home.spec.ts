import { test, expect } from '@playwright/test'

test.describe('home smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows Storyteller Copilot and Start setup', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Storyteller Copilot')).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Start setup' }).or(
        page.getByRole('button', { name: 'Start setup' }),
      ),
    ).toBeVisible()
  })

  test('Start setup navigates to /setup', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Start setup' })
      .or(page.getByRole('button', { name: 'Start setup' }))
      .click()
    await expect(page).toHaveURL(/\/setup/)
    await expect(page.getByRole('heading', { name: 'Setup' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
  })
})
