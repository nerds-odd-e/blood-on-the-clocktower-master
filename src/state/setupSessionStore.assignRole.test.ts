import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildBag } from '../domain/bag'
import { loadCatalog } from '../domain/script'

vi.mock('./idbStorage', () => ({
  idbStorage: {
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
  },
}))

const { useSetupSessionStore } = await import('./setupSessionStore')

const catalog = loadCatalog()

describe('assignRole Drunk cover', () => {
  beforeEach(() => {
    useSetupSessionStore.setState({
      wizardStep: 'record',
      players: Array.from({ length: 8 }, (_, index) => ({
        id: `p${index + 1}`,
        name: `Player ${index + 1}`,
      })),
      difficulty: 'standard',
      bag: null,
      assignments: {},
      hasHydrated: true,
      hydrationError: false,
    })
  })

  it('persists trueRoleId drunk and believedRoleId equal to the cover bagRoleId', () => {
    const values = [0.99, 0, 0, 0, 0, 0, 0, 0]
    const bag = buildBag({
      playerCount: 8,
      difficulty: 'standard',
      catalog,
      rng: () => values.shift() ?? 0,
    })
    expect(bag.drunk).not.toBeNull()
    const coverRoleId = bag.drunk!.coverRoleId

    useSetupSessionStore.setState({ bag, assignments: {} })
    useSetupSessionStore.getState().assignRole('p1', coverRoleId)

    expect(useSetupSessionStore.getState().assignments.p1).toEqual({
      playerId: 'p1',
      bagRoleId: coverRoleId,
      trueRoleId: 'drunk',
      believedRoleId: coverRoleId,
    })
  })
})
