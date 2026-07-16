import { beforeEach, describe, expect, it, vi } from 'vitest'
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

describe('toggleDead / setPlayerReminders / startOtherNight', () => {
  beforeEach(() => {
    useSetupSessionStore.setState({
      wizardStep: 'nightReady',
      players: [
        { id: 'p1', name: 'Alice' },
        { id: 'p2', name: 'Ben' },
      ],
      difficulty: 'standard',
      bag: null,
      assignments: {
        p1: {
          playerId: 'p1',
          bagRoleId: 'washerwoman',
          trueRoleId: 'washerwoman',
          believedRoleId: 'washerwoman',
        },
        p2: {
          playerId: 'p2',
          bagRoleId: 'imp',
          trueRoleId: 'imp',
          believedRoleId: 'imp',
        },
      },
      nightKind: 'other',
      beatIndex: 3,
      playSurface: 'grimoire',
      deadPlayerIds: [],
      reminders: {},
      demonBluffs: [],
      diedTonightIds: [],
      playStarted: true,
      hasHydrated: true,
      hydrationError: false,
    })
  })

  it('toggleDead adds and removes deadPlayerIds and tracks diedTonightIds', () => {
    useSetupSessionStore.getState().toggleDead('p1')
    expect(useSetupSessionStore.getState().deadPlayerIds).toEqual(['p1'])
    expect(useSetupSessionStore.getState().diedTonightIds).toEqual(['p1'])

    useSetupSessionStore.getState().toggleDead('p1')
    expect(useSetupSessionStore.getState().deadPlayerIds).toEqual([])
    // diedTonightIds keeps tonight death for Ravenkeeper gating until startOtherNight
    expect(useSetupSessionStore.getState().diedTonightIds).toEqual(['p1'])
  })

  it('setPlayerReminders only accepts catalog role.reminders strings', () => {
    const washer = catalog.roles.find((role) => role.id === 'washerwoman')
    expect(washer?.reminders.length).toBeGreaterThan(0)
    const catalogToken = washer!.reminders[0]!

    useSetupSessionStore
      .getState()
      .setPlayerReminders('p1', [catalogToken, 'NOT_A_REAL_TOKEN', catalogToken])
    expect(useSetupSessionStore.getState().reminders.p1).toEqual([catalogToken])

    useSetupSessionStore.getState().setPlayerReminders('p1', [])
    expect(useSetupSessionStore.getState().reminders.p1).toEqual([])
  })

  it('startOtherNight resets night cursor and clears diedTonightIds', () => {
    useSetupSessionStore.setState({
      deadPlayerIds: ['p1'],
      diedTonightIds: ['p1'],
      beatIndex: 5,
      playSurface: 'bridge',
      nightKind: 'first',
    })
    useSetupSessionStore.getState().startOtherNight()
    const state = useSetupSessionStore.getState()
    expect(state.nightKind).toBe('other')
    expect(state.beatIndex).toBe(0)
    expect(state.diedTonightIds).toEqual([])
    expect(state.playSurface).toBe('coach')
    expect(state.deadPlayerIds).toEqual(['p1'])
  })
})
