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
    await expect(
      page.getByRole('heading', { name: 'Trouble Brewing' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Continue setup' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
  })

  for (const path of ['/', '/setup', '/play'] as const) {
    test(`PLAT-01: ${path} has no horizontal document scroll`, async ({
      page,
    }) => {
      await page.goto(path)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })
  }

  test('home has no account login or signup affordances', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/log\s*in/i)).toHaveCount(0)
    await expect(page.getByText(/sign\s*up/i)).toHaveCount(0)
    await expect(page.getByRole('link', { name: /account/i })).toHaveCount(0)
  })
})
