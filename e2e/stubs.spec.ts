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

  test('/play shows coach-or-empty surface (not a Play stub heading)', async ({
    page,
  }) => {
    await page.goto('/play')
    // Empty session: Nothing to coach yet. Active session: night meta / beat title.
    // Do not treat "Play" stub heading + Back to home as the play contract.
    const emptyHeading = page.getByRole('heading', {
      name: 'Nothing to coach yet',
    })
    const nightMeta = page.getByText(/(First|Other) night · step/i)
    await expect(emptyHeading.or(nightMeta)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Play' })).toHaveCount(0)
  })
})

