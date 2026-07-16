import { describe, expect, it } from 'vitest'
import { loadCatalog } from '../script'
import { buildBag } from './buildBag'
import { validateBag } from './validateBag'
import type { Difficulty } from './types'

const catalog = loadCatalog()
const difficulties: Difficulty[] = ['easy', 'standard', 'hard']

describe('buildBag', () => {
  for (let playerCount = 5; playerCount <= 15; playerCount += 1) {
    for (const difficulty of difficulties) {
      it(`builds a legal ${difficulty} bag for ${playerCount} players`, () => {
        const bag = buildBag({
          playerCount,
          difficulty,
          catalog,
          rng: () => 0.42,
        })

        expect(bag.tokens).toHaveLength(playerCount)
        expect(bag.tokens).toContain('imp')
        expect(bag.tokens).not.toContain('drunk')
        expect(validateBag(bag, playerCount, catalog)).toEqual({
          ok: true,
          issues: [],
        })
      })
    }
  }

  it('applies the Baron +2 Outsiders and -2 Townsfolk setup change', () => {
    const values = [0.99, 0, 0, 0, 0, 0, 0, 0]
    const bag = buildBag({
      playerCount: 8,
      difficulty: 'standard',
      catalog,
      rng: () => values.shift() ?? 0,
    })

    expect(bag.tokens).toContain('baron')
    expect(bag.composition).toEqual({
      townsfolk: 3,
      outsiders: 3,
      minions: 1,
      demons: 1,
    })
    expect(bag.setupNotes).toContain(
      'Baron: add 2 Outsiders and remove 2 Townsfolk.',
    )
  })

  it('replaces the Drunk with an unused Townsfolk cover token', () => {
    const values = [0.99, 0, 0, 0, 0, 0, 0, 0]
    const bag = buildBag({
      playerCount: 8,
      difficulty: 'standard',
      catalog,
      rng: () => values.shift() ?? 0,
    })

    expect(bag.drunk).not.toBeNull()
    expect(bag.tokens).not.toContain('drunk')
    expect(bag.tokens).toContain(bag.drunk?.coverRoleId)
    expect(
      catalog.roles.find((role) => role.id === bag.drunk?.coverRoleId)?.team,
    ).toBe('townsfolk')
    expect(validateBag(bag, 8, catalog).ok).toBe(true)
  })

  it('accepts only player count, difficulty, catalog, and optional rng inputs', () => {
    const input: Parameters<typeof buildBag>[0] = {
      playerCount: 5,
      difficulty: 'standard',
      catalog,
      rng: () => 0.5,
    }

    expect(buildBag(input).tokens).toHaveLength(5)
  })
})
