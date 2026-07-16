import { describe, expect, it } from 'vitest'
import type { Assignment } from './types'
import { loadCatalog } from '../script'
import { eligibleBluffRoleIds } from './eligibleBluffs'

const catalog = loadCatalog()

describe('eligibleBluffRoleIds', () => {
  it('returns only townsfolk and outsiders that are not in play', () => {
    const assignments: Record<string, Assignment> = {
      p1: { playerId: 'p1', bagRoleId: 'washerwoman' },
      p2: { playerId: 'p2', bagRoleId: 'librarian' },
      p3: { playerId: 'p3', bagRoleId: 'empath' },
      p4: { playerId: 'p4', bagRoleId: 'investigator' },
      p5: { playerId: 'p5', bagRoleId: 'chef' },
      p6: { playerId: 'p6', bagRoleId: 'poisoner' },
      p7: { playerId: 'p7', bagRoleId: 'imp' },
    }

    const eligible = eligibleBluffRoleIds(assignments, catalog)

    expect(eligible.length).toBeGreaterThan(0)
    for (const roleId of eligible) {
      const role = catalog.roles.find((r) => r.id === roleId)
      expect(role).toBeDefined()
      expect(['townsfolk', 'outsider']).toContain(role!.team)
      expect(['minion', 'demon']).not.toContain(role!.team)
    }

    expect(eligible).not.toContain('washerwoman')
    expect(eligible).not.toContain('librarian')
    expect(eligible).not.toContain('empath')
    expect(eligible).not.toContain('investigator')
    expect(eligible).not.toContain('chef')
    expect(eligible).not.toContain('poisoner')
    expect(eligible).not.toContain('imp')
    expect(eligible).not.toContain('baron')
    expect(eligible).not.toContain('scarletwoman')
    expect(eligible).not.toContain('spy')
  })

  it('excludes Drunk cover tokens and true Drunk identity from the bluff pool', () => {
    const assignments: Record<string, Assignment> = {
      p1: {
        playerId: 'p1',
        bagRoleId: 'washerwoman',
        trueRoleId: 'drunk',
        believedRoleId: 'washerwoman',
      },
      p2: { playerId: 'p2', bagRoleId: 'librarian' },
      p3: { playerId: 'p3', bagRoleId: 'empath' },
      p4: { playerId: 'p4', bagRoleId: 'investigator' },
      p5: { playerId: 'p5', bagRoleId: 'chef' },
      p6: { playerId: 'p6', bagRoleId: 'poisoner' },
      p7: { playerId: 'p7', bagRoleId: 'imp' },
    }

    const eligible = eligibleBluffRoleIds(assignments, catalog)

    expect(eligible).not.toContain('washerwoman')
    expect(eligible).not.toContain('drunk')
    expect(eligible).not.toContain('poisoner')
    expect(eligible).not.toContain('imp')
  })
})
