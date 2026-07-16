import { describe, expect, it } from 'vitest'
import { buildBag } from '../domain/bag'
import { loadCatalog } from '../domain/script'
import { assertSetupSessionSemantics } from './setupSessionSemantics'
import type { PersistedSetupSession } from './setupSessionSemantics'

const catalog = loadCatalog()

function basePlayers(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Player ${index + 1}`,
  }))
}

function legalSession(
  overrides: Partial<PersistedSetupSession> = {},
): PersistedSetupSession {
  const players = overrides.players ?? basePlayers(5)
  const bag =
    'bag' in overrides
      ? (overrides.bag ?? null)
      : buildBag({
          playerCount: players.length,
          difficulty: 'standard',
          catalog,
          rng: () => 0.42,
        })
  return {
    wizardStep: 'nightReady',
    difficulty: 'standard',
    assignments: {},
    ...overrides,
    players,
    bag,
  }
}

describe('assertSetupSessionSemantics', () => {
  it('accepts a legal nightReady session', () => {
    expect(assertSetupSessionSemantics(legalSession(), catalog)).toEqual({
      ok: true,
    })
  })

  it('rejects bag/deal/record/nightReady when bag is null', () => {
    for (const wizardStep of ['bag', 'deal', 'record', 'nightReady'] as const) {
      const result = assertSetupSessionSemantics(
        legalSession({ wizardStep, bag: null }),
        catalog,
      )
      expect(result.ok).toBe(false)
    }
  })

  it('allows null bag on early wizard steps', () => {
    for (const wizardStep of ['script', 'players', 'difficulty'] as const) {
      expect(
        assertSetupSessionSemantics(
          {
            wizardStep,
            players: [],
            difficulty: 'standard',
            bag: null,
            assignments: {},
          },
          catalog,
        ),
      ).toEqual({ ok: true })
    }
  })

  it('rejects when bag.tokens.length does not match players.length', () => {
    const bag = buildBag({
      playerCount: 5,
      difficulty: 'standard',
      catalog,
      rng: () => 0.42,
    })
    const result = assertSetupSessionSemantics(
      legalSession({
        wizardStep: 'record',
        players: basePlayers(6),
        bag,
      }),
      catalog,
    )
    expect(result.ok).toBe(false)
  })

  it('rejects bags that fail validateBag', () => {
    const bag = buildBag({
      playerCount: 5,
      difficulty: 'standard',
      catalog,
      rng: () => 0.42,
    })
    const result = assertSetupSessionSemantics(
      legalSession({
        bag: { ...bag, tokens: [...bag.tokens, 'washerwoman'] },
      }),
      catalog,
    )
    expect(result.ok).toBe(false)
  })

  it('rejects duplicate player ids', () => {
    const players = basePlayers(5)
    players[1] = { ...players[1], id: players[0].id }
    const result = assertSetupSessionSemantics(
      legalSession({ players }),
      catalog,
    )
    expect(result.ok).toBe(false)
  })

  it('rejects assignment key/playerId mismatch and orphan keys', () => {
    const players = basePlayers(5)
    const bag = buildBag({
      playerCount: 5,
      difficulty: 'standard',
      catalog,
      rng: () => 0.42,
    })
    const mismatch = assertSetupSessionSemantics(
      legalSession({
        players,
        bag,
        assignments: {
          p1: {
            playerId: 'p2',
            bagRoleId: bag.tokens[0],
            trueRoleId: bag.tokens[0],
            believedRoleId: bag.tokens[0],
          },
        },
      }),
      catalog,
    )
    expect(mismatch.ok).toBe(false)

    const orphan = assertSetupSessionSemantics(
      legalSession({
        players,
        bag,
        assignments: {
          missing: {
            playerId: 'missing',
            bagRoleId: bag.tokens[0],
            trueRoleId: bag.tokens[0],
            believedRoleId: bag.tokens[0],
          },
        },
      }),
      catalog,
    )
    expect(orphan.ok).toBe(false)
  })

  it('rejects invented bagRoleId values not present in bag.tokens', () => {
    const players = basePlayers(5)
    const bag = buildBag({
      playerCount: 5,
      difficulty: 'standard',
      catalog,
      rng: () => 0.42,
    })
    const result = assertSetupSessionSemantics(
      legalSession({
        players,
        bag,
        assignments: {
          p1: {
            playerId: 'p1',
            bagRoleId: 'not-a-real-token',
            trueRoleId: 'not-a-real-token',
            believedRoleId: 'not-a-real-token',
          },
        },
      }),
      catalog,
    )
    expect(result.ok).toBe(false)
  })

  it('rejects Drunk cover assignments missing trueRoleId drunk', () => {
    const players = basePlayers(8)
    const values = [0.99, 0, 0, 0, 0, 0, 0, 0]
    const bag = buildBag({
      playerCount: 8,
      difficulty: 'standard',
      catalog,
      rng: () => values.shift() ?? 0,
    })
    expect(bag.drunk).not.toBeNull()
    const result = assertSetupSessionSemantics(
      legalSession({
        players,
        bag,
        assignments: {
          p1: {
            playerId: 'p1',
            bagRoleId: bag.drunk!.coverRoleId,
            trueRoleId: bag.drunk!.coverRoleId,
            believedRoleId: bag.drunk!.coverRoleId,
          },
        },
      }),
      catalog,
    )
    expect(result.ok).toBe(false)
  })

  it('rejects downstream steps with invalid roster (empty names / wrong count)', () => {
    const bag = buildBag({
      playerCount: 5,
      difficulty: 'standard',
      catalog,
      rng: () => 0.42,
    })
    const emptyName = assertSetupSessionSemantics(
      legalSession({
        players: [
          { id: 'p1', name: 'Alice' },
          { id: 'p2', name: '   ' },
          { id: 'p3', name: 'Clara' },
          { id: 'p4', name: 'Diego' },
          { id: 'p5', name: 'Evelyn' },
        ],
        bag,
      }),
      catalog,
    )
    expect(emptyName.ok).toBe(false)

    const tooFew = assertSetupSessionSemantics(
      {
        wizardStep: 'bag',
        players: basePlayers(4),
        difficulty: 'standard',
        bag: null,
        assignments: {},
      },
      catalog,
    )
    expect(tooFew.ok).toBe(false)
  })
})
