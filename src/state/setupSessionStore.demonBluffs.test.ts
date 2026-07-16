import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadCatalog } from '../domain/script'
import { eligibleBluffRoleIds } from '../domain/grimoire'

vi.mock('./idbStorage', () => ({
  idbStorage: {
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
  },
}))

const { useSetupSessionStore } = await import('./setupSessionStore')

const catalog = loadCatalog()

const assignments = {
  p1: { playerId: 'p1', bagRoleId: 'washerwoman' },
  p2: { playerId: 'p2', bagRoleId: 'librarian' },
  p3: { playerId: 'p3', bagRoleId: 'empath' },
  p4: { playerId: 'p4', bagRoleId: 'investigator' },
  p5: { playerId: 'p5', bagRoleId: 'chef' },
  p6: { playerId: 'p6', bagRoleId: 'poisoner' },
  p7: { playerId: 'p7', bagRoleId: 'imp' },
}

describe('setDemonBluffs / toggleDemonBluff', () => {
  beforeEach(() => {
    useSetupSessionStore.setState({
      wizardStep: 'nightReady',
      players: Array.from({ length: 7 }, (_, index) => ({
        id: `p${index + 1}`,
        name: `Player ${index + 1}`,
      })),
      difficulty: 'standard',
      bag: null,
      assignments,
      demonBluffs: [],
      hasHydrated: true,
      hydrationError: false,
    })
  })

  it('refuses minion and demon role ids', () => {
    useSetupSessionStore.getState().setDemonBluffs(['poisoner', 'imp', 'monk'])
    expect(useSetupSessionStore.getState().demonBluffs).toEqual(['monk'])
  })

  it('refuses in-play townsfolk and caps at three', () => {
    useSetupSessionStore
      .getState()
      .setDemonBluffs(['washerwoman', 'monk', 'virgin', 'slayer', 'soldier'])
    expect(useSetupSessionStore.getState().demonBluffs).toEqual([
      'monk',
      'virgin',
      'slayer',
    ])
  })

  it('toggle ignores ineligible ids and ignores taps past three selected', () => {
    const eligible = eligibleBluffRoleIds(assignments, catalog)
    expect(eligible.length).toBeGreaterThanOrEqual(3)

    useSetupSessionStore.getState().toggleDemonBluff('poisoner')
    expect(useSetupSessionStore.getState().demonBluffs).toEqual([])

    useSetupSessionStore.getState().toggleDemonBluff(eligible[0]!)
    useSetupSessionStore.getState().toggleDemonBluff(eligible[1]!)
    useSetupSessionStore.getState().toggleDemonBluff(eligible[2]!)
    useSetupSessionStore.getState().toggleDemonBluff(eligible[3]!)
    expect(useSetupSessionStore.getState().demonBluffs).toEqual([
      eligible[0],
      eligible[1],
      eligible[2],
    ])

    useSetupSessionStore.getState().toggleDemonBluff(eligible[0]!)
    expect(useSetupSessionStore.getState().demonBluffs).toEqual([
      eligible[1],
      eligible[2],
    ])
  })
})
