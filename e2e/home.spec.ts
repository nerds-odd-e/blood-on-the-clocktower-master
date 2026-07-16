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

  test('hides Start over when session is fresh', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('tb-script-card')).toBeVisible()
    await expect(page.getByTestId('home-start-over')).toHaveCount(0)
  })

  test('Start over clears session after confirm', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Start setup' })
      .or(page.getByRole('button', { name: 'Start setup' }))
      .click()
    await page.getByRole('button', { name: 'Continue setup' }).click()
    await page.getByRole('button', { name: 'Add player' }).click()
    await page.getByLabel('Player 1 name').fill('Alice')

    await page.getByRole('button', { name: 'Back' }).click()
    await page.getByRole('link', { name: 'Back to home' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByTestId('home-start-over')).toBeVisible()

    await page.getByTestId('home-start-over').click()
    await expect(
      page.getByRole('heading', { name: 'Start over?' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Keep game' }).click()
    await expect(page.getByTestId('home-start-over')).toBeVisible()

    await page.getByTestId('home-start-over').click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Start over' })
      .click()
    await expect(page.getByTestId('home-start-over')).toHaveCount(0)

    await page
      .getByRole('link', { name: 'Start setup' })
      .or(page.getByRole('button', { name: 'Start setup' }))
      .click()
    await expect(
      page.getByRole('heading', { name: 'Trouble Brewing' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Continue setup' }).click()
    await expect(page.getByRole('heading', { name: 'No players yet' })).toBeVisible()
  })
})
