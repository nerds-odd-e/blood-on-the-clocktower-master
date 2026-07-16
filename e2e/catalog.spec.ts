import { test, expect } from '@playwright/test'

/**
 * Catalog correctness against the real preview app + bundled TB data (D-07 D-08).
 * Do not import catalog JSON here — assert only through the UI.
 */
test.describe('TB catalog', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('home shows Trouble Brewing Available with catalog meta', async ({
    page,
  }) => {
    await page.goto('/')

    const card = page.getByTestId('tb-script-card')
    await expect(card).toBeVisible()
    await expect(card.getByRole('heading', { name: 'Trouble Brewing' })).toBeVisible()
    await expect(card.getByText('Available')).toBeVisible()
    await expect(card.getByText('22 roles · setup chart · night order')).toBeVisible()
    await expect(page.getByTestId('offline-ready')).toBeVisible()
  })

  test('UI reveals 22 roles and team split 13/4/4/1', async ({ page }) => {
    await page.goto('/')

    const card = page.getByTestId('tb-script-card')
    await expect(card).toHaveAttribute('data-role-total', '22')

    const counts = page.getByTestId('tb-team-counts')
    await expect(counts).toHaveAttribute('data-team-count-townsfolk', '13')
    await expect(counts).toHaveAttribute('data-team-count-outsider', '4')
    await expect(counts).toHaveAttribute('data-team-count-minion', '4')
    await expect(counts).toHaveAttribute('data-team-count-demon', '1')

    const rows = page.getByTestId('tb-role-row')
    await expect(rows).toHaveCount(22)
  })

  test('setup chart ready for player counts 5 through 15', async ({ page }) => {
    await page.goto('/')

    const chart = page.getByTestId('tb-setup-chart')
    await expect(chart).toHaveAttribute('data-setup-chart-ready', 'true')
    await expect(chart).toHaveAttribute('data-setup-row-count', '11')
    await expect(chart).toHaveAttribute(
      'data-player-counts',
      '5,6,7,8,9,10,11,12,13,14,15',
    )
  })

  test('first-night ordinal sample from visible roster data', async ({
    page,
  }) => {
    await page.goto('/')

    const poisoner = page.locator('[data-testid="tb-role-row"][data-role-id="poisoner"]')
    const washerwoman = page.locator(
      '[data-testid="tb-role-row"][data-role-id="washerwoman"]',
    )
    const spy = page.locator('[data-testid="tb-role-row"][data-role-id="spy"]')

    await expect(poisoner).toBeVisible()
    await expect(washerwoman).toBeVisible()
    await expect(spy).toBeVisible()

    const poisonerNight = Number(await poisoner.getAttribute('data-first-night'))
    const washerNight = Number(await washerwoman.getAttribute('data-first-night'))
    const spyNight = Number(await spy.getAttribute('data-first-night'))

    // Curated townsquare ordinals: Poisoner before info townsfolk and Spy
    expect(poisonerNight).toBeGreaterThan(0)
    expect(poisonerNight).toBeLessThan(washerNight)
    expect(poisonerNight).toBeLessThan(spyNight)
  })

  test('page does not gain horizontal scroll at phone viewport', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByTestId('tb-role-roster')).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth > doc.clientWidth + 1
    })
    expect(hasHorizontalOverflow).toBe(false)
  })
})
