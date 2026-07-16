import { describe, expect, it } from 'vitest'
import { loadCatalog } from '../script'
import { composePrompt } from './composePrompt'

const catalog = loadCatalog()

describe('composePrompt', () => {
  it('returns short and detail strings for a dusk procedure beat', () => {
    const prompt = composePrompt(
      { kind: 'procedure', id: 'dusk', label: 'Dusk' },
      { nightKind: 'first', catalog },
    )

    expect(typeof prompt.short).toBe('string')
    expect(prompt.short.length).toBeGreaterThan(0)
    expect(typeof prompt.detail).toBe('string')
    expect(prompt.detail.length).toBeGreaterThan(0)
  })

  it('returns short and detail strings for a role wake beat', () => {
    const prompt = composePrompt(
      {
        kind: 'wake',
        id: 'wake:p1:poisoner',
        roleId: 'poisoner',
        playerId: 'p1',
        label: 'Poisoner',
      },
      {
        nightKind: 'first',
        catalog,
        playerName: 'Alice',
      },
    )

    expect(typeof prompt.short).toBe('string')
    expect(prompt.short.length).toBeGreaterThan(0)
    expect(typeof prompt.detail).toBe('string')
    expect(prompt.detail.length).toBeGreaterThan(0)
  })
})
