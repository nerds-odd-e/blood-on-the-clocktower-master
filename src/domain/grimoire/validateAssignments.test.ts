import { describe, expect, it } from 'vitest'
import type { BagPlan } from '../bag'
import { validateAssignments } from './validateAssignments'

const bag: BagPlan = {
  tokens: ['washerwoman', 'empath', 'imp'],
  composition: { townsfolk: 2, outsiders: 0, minions: 0, demons: 1 },
  drunk: null,
  setupNotes: [],
  whyNote: 'Test bag',
}

const players = [{ id: 'alice' }, { id: 'ben' }, { id: 'clara' }]

describe('validateAssignments', () => {
  it('is clean when every player has exactly one physical bag token', () => {
    expect(
      validateAssignments({
        players,
        bag,
        assignments: {
          alice: { playerId: 'alice', bagRoleId: 'washerwoman' },
          ben: { playerId: 'ben', bagRoleId: 'empath' },
          clara: { playerId: 'clara', bagRoleId: 'imp' },
        },
      }),
    ).toEqual([])
  })

  it('reports each unassigned player and the resulting token mismatch', () => {
    const issues = validateAssignments({
      players,
      bag,
      assignments: {
        alice: { playerId: 'alice', bagRoleId: 'washerwoman' },
      },
    })

    expect(issues).toContainEqual({ code: 'unassigned', playerId: 'ben' })
    expect(issues).toContainEqual({ code: 'unassigned', playerId: 'clara' })
    expect(issues.some((issue) => issue.code === 'token_mismatch')).toBe(true)
  })

  it('reports a physical token assigned more times than the bag contains', () => {
    const issues = validateAssignments({
      players,
      bag,
      assignments: {
        alice: { playerId: 'alice', bagRoleId: 'washerwoman' },
        ben: { playerId: 'ben', bagRoleId: 'washerwoman' },
        clara: { playerId: 'clara', bagRoleId: 'imp' },
      },
    })

    expect(issues).toContainEqual({
      code: 'duplicate_token',
      roleId: 'washerwoman',
    })
    expect(issues.some((issue) => issue.code === 'token_mismatch')).toBe(true)
  })
})
