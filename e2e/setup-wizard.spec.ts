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

    const firstPlayer = page.getByTestId('setup-player-row').first()
    await firstPlayer.getByRole('button', { name: 'More' }).click()
    await firstPlayer.getByRole('button', { name: 'New' }).click()
    await firstPlayer.getByRole('button', { name: 'Adult' }).click()
    await firstPlayer
      .getByPlaceholder('Optional notes')
      .fill('First-time player; offer short prompts.')

    await page.getByRole('button', { name: 'Next step' }).click()
    await expect(page.getByRole('heading', { name: 'Difficulty' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Standard' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await page.getByRole('button', { name: 'Back' }).click()
    const persistedFirstPlayer = page.getByTestId('setup-player-row').first()
    await persistedFirstPlayer.getByRole('button', { name: 'More' }).click()
    await expect(
      persistedFirstPlayer.getByRole('button', { name: 'New' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      persistedFirstPlayer.getByRole('button', { name: 'Adult' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      persistedFirstPlayer.getByPlaceholder('Optional notes'),
    ).toHaveValue('First-time player; offer short prompts.')
  })

  test('blocks invalid rosters and checks trimmed duplicate names on Next', async ({
    page,
  }) => {
    await page.goto('/setup')
    await page.getByRole('button', { name: 'Continue setup' }).click()

    await expect(page.getByRole('heading', { name: 'No players yet' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next step' })).toBeDisabled()

    for (const [index, name] of [
      'Alice',
      ' Alice ',
      'Clara',
      'Diego',
      'Evelyn',
    ].entries()) {
      await page.getByRole('button', { name: 'Add player' }).click()
      await page.getByLabel(`Player ${index + 1} name`).fill(name)
    }

    await page.getByRole('button', { name: 'Next step' }).click()
    await expect(
      page.getByText(
        'Each player needs a unique name. Fix duplicates, then try Next step.',
      ),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Players' })).toBeVisible()
  })

  test('recovers a corrupt persisted session into a fresh wizard', async ({
    page,
  }) => {
    await page.goto('/setup')
    await expect(
      page.getByRole('heading', { name: 'Trouble Brewing' }),
    ).toBeVisible()

    await page.evaluate(async () => {
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('keyval-store')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('keyval', 'readwrite')
        transaction
          .objectStore('keyval')
          .put('not valid JSON', 'st-copilot-setup-session')
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })
      database.close()
    })

    await page.reload()
    await expect(page.getByText(/Couldn’t restore your setup/)).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Trouble Brewing' }),
    ).toBeVisible()
  })
})
