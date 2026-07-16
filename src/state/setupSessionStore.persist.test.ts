import { beforeEach, describe, expect, it, vi } from 'vitest'

const setItem = vi.fn(async (_name: string, _value: string) => undefined)

vi.mock('./idbStorage', () => ({
  idbStorage: {
    getItem: async () => null,
    setItem: (name: string, value: string) => setItem(name, value),
    removeItem: async () => undefined,
  },
}))

const { useSetupSessionStore } = await import('./setupSessionStore')

describe('awaitCriticalPersist', () => {
  beforeEach(() => {
    setItem.mockReset()
    setItem.mockResolvedValue(undefined)
    useSetupSessionStore.setState({
      wizardStep: 'nightReady',
      players: [
        { id: 'p1', name: 'Alice' },
        { id: 'p2', name: 'Ben' },
        { id: 'p3', name: 'Clara' },
        { id: 'p4', name: 'Diego' },
        { id: 'p5', name: 'Evelyn' },
      ],
      difficulty: 'standard',
      bag: {
        tokens: ['washerwoman', 'librarian', 'investigator', 'chef', 'imp'],
        composition: {
          townsfolk: 3,
          outsiders: 0,
          minions: 1,
          demons: 1,
        },
        drunk: null,
        setupNotes: [],
        whyNote: 'test',
      },
      assignments: {},
      hasHydrated: true,
      hydrationError: false,
      persistWriteStatus: 'saving',
    })
  })

  it('sets persistWriteStatus to saved after a successful critical write', async () => {
    await useSetupSessionStore.getState().awaitCriticalPersist()
    expect(useSetupSessionStore.getState().persistWriteStatus).toBe('saved')
    expect(setItem).toHaveBeenCalledWith(
      'st-copilot-setup-session',
      expect.stringContaining('"wizardStep":"nightReady"'),
    )
  })

  it('sets persistWriteStatus to error when the critical write rejects', async () => {
    // Reject every setItem — middleware may also write when status flips to saving.
    setItem.mockRejectedValue(new Error('disk full'))
    await useSetupSessionStore.getState().awaitCriticalPersist()
    expect(useSetupSessionStore.getState().persistWriteStatus).toBe('error')
  })
})
