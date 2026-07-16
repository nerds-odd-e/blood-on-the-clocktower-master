import { test, expect, type Page } from '@playwright/test'

/**
 * PLAT-02 offline proof against real vite preview + generateSW (D-08).
 * Exercises the live SW and bundled catalog only — no fakes.
 */
test.describe('offline PWA reload', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('reloads home and /setup offline after first online load', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Storyteller Copilot')).toBeVisible()
    await expect(page.getByTestId('offline-ready')).toBeVisible()
    await expect(
      page.getByTestId('tb-script-card').getByRole('heading', {
        name: 'Trouble Brewing',
      }),
    ).toBeVisible()

    await waitForServiceWorkerControl(page)

    await context.setOffline(true)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Storyteller Copilot')).toBeVisible()
    await expect(
      page.getByTestId('tb-script-card').getByRole('heading', {
        name: 'Trouble Brewing',
      }),
    ).toBeVisible()
    await expect(page.getByTestId('offline-ready')).toBeVisible()

    await page.goto('/setup', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Setup' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
  })
})

test.describe('phone viewport and no accounts', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  for (const path of ['/', '/setup', '/play'] as const) {
    test(`${path} has no horizontal overflow at 390x844`, async ({ page }) => {
      await page.goto(path)
      const overflow = await page.evaluate(() => {
        const el = document.documentElement
        return {
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        }
      })
      expect(
        overflow.scrollWidth,
        `${path} scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`,
      ).toBeLessThanOrEqual(overflow.clientWidth)
    })

    test(`${path} has no login or account UI`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByText(/log\s*in/i)).toHaveCount(0)
      await expect(page.getByText(/sign\s*up/i)).toHaveCount(0)
      await expect(page.getByText(/create\s*account/i)).toHaveCount(0)
      await expect(page.getByRole('link', { name: /account/i })).toHaveCount(0)
      await expect(page.getByRole('button', { name: /account/i })).toHaveCount(
        0,
      )
    })
  }
})

/** Wait until this document is controlled by the generateSW worker (clientsClaim). */
async function waitForServiceWorkerControl(page: Page): Promise<void> {
  await page.waitForFunction(
    () => !!navigator.serviceWorker?.controller,
    undefined,
    { timeout: 5_000 },
  ).catch(() => undefined)

  const controlled = await page.evaluate(
    () => !!navigator.serviceWorker?.controller,
  )
  if (!controlled) {
    // First visit often registers before the page is claimed — one reload attaches controller.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Storyteller Copilot')).toBeVisible()
    await page.waitForFunction(
      () => !!navigator.serviceWorker?.controller,
      undefined,
      { timeout: 30_000 },
    )
  }
}
