import { describe, expect, it } from 'vitest'
import type { Assignment } from '../grimoire'
import { loadCatalog } from '../script'
import { buildNightBeats } from './buildNightBeats'

const catalog = loadCatalog()

function players(count: number): { id: string; name: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i + 1}`,
    name: `Player ${i + 1}`,
  }))
}

function assignment(
  playerId: string,
  bagRoleId: string,
  extras: Partial<Assignment> = {},
): Assignment {
  return { playerId, bagRoleId, ...extras }
}

describe('buildNightBeats', () => {
  it('omits Minion Info and Demon Info on first night with 5 players', () => {
    const roster = players(5)
    const assignments: Record<string, Assignment> = {
      p1: assignment('p1', 'washerwoman'),
      p2: assignment('p2', 'librarian'),
      p3: assignment('p3', 'empath'),
      p4: assignment('p4', 'poisoner'),
      p5: assignment('p5', 'imp'),
    }

    const beats = buildNightBeats(
      'first',
      {
        players: roster,
        assignments,
        deadPlayerIds: new Set(),
      },
      catalog,
    )

    const procedureIds = beats
      .filter((b) => b.kind === 'procedure')
      .map((b) => b.id)
    expect(procedureIds).toContain('dusk')
    expect(procedureIds).toContain('dawn')
    expect(procedureIds).not.toContain('minion-info')
    expect(procedureIds).not.toContain('demon-info')
  })

  it('includes Minion Info and Demon Info on first night at 7+ with minion and demon in play', () => {
    const roster = players(7)
    const assignments: Record<string, Assignment> = {
      p1: assignment('p1', 'washerwoman'),
      p2: assignment('p2', 'librarian'),
      p3: assignment('p3', 'empath'),
      p4: assignment('p4', 'investigator'),
      p5: assignment('p5', 'chef'),
      p6: assignment('p6', 'poisoner'),
      p7: assignment('p7', 'imp'),
    }

    const beats = buildNightBeats(
      'first',
      {
        players: roster,
        assignments,
        deadPlayerIds: new Set(),
      },
      catalog,
    )

    const procedureIds = beats
      .filter((b) => b.kind === 'procedure')
      .map((b) => b.id)
    expect(procedureIds).toContain('minion-info')
    expect(procedureIds).toContain('demon-info')
  })

  it('wakes the Drunk via believedRoleId on first night', () => {
    const roster = players(7)
    const assignments: Record<string, Assignment> = {
      p1: assignment('p1', 'washerwoman', {
        trueRoleId: 'drunk',
        believedRoleId: 'washerwoman',
      }),
      p2: assignment('p2', 'librarian'),
      p3: assignment('p3', 'empath'),
      p4: assignment('p4', 'investigator'),
      p5: assignment('p5', 'chef'),
      p6: assignment('p6', 'poisoner'),
      p7: assignment('p7', 'imp'),
    }

    const beats = buildNightBeats(
      'first',
      {
        players: roster,
        assignments,
        deadPlayerIds: new Set(),
      },
      catalog,
    )

    const drunkWake = beats.find(
      (b) => b.kind === 'wake' && b.playerId === 'p1',
    )
    expect(drunkWake).toBeDefined()
    expect(drunkWake).toMatchObject({
      kind: 'wake',
      roleId: 'washerwoman',
      playerId: 'p1',
    })
    expect(
      beats.some(
        (b) => b.kind === 'wake' && b.roleId === 'drunk' && b.playerId === 'p1',
      ),
    ).toBe(false)
  })

  it('omits dead players on other nights except Ravenkeeper when in diedTonightIds', () => {
    const roster = players(7)
    const assignments: Record<string, Assignment> = {
      p1: assignment('p1', 'ravenkeeper'),
      p2: assignment('p2', 'empath'),
      p3: assignment('p3', 'fortuneteller'),
      p4: assignment('p4', 'monk'),
      p5: assignment('p5', 'slayer'),
      p6: assignment('p6', 'poisoner'),
      p7: assignment('p7', 'imp'),
    }

    const deadWithoutRaven = buildNightBeats(
      'other',
      {
        players: roster,
        assignments,
        deadPlayerIds: new Set(['p1', 'p2']),
        diedTonightIds: new Set(),
      },
      catalog,
    )
    expect(
      deadWithoutRaven.some(
        (b) => b.kind === 'wake' && b.playerId === 'p1',
      ),
    ).toBe(false)
    expect(
      deadWithoutRaven.some(
        (b) => b.kind === 'wake' && b.playerId === 'p2',
      ),
    ).toBe(false)

    const ravenDiedTonight = buildNightBeats(
      'other',
      {
        players: roster,
        assignments,
        deadPlayerIds: new Set(['p1']),
        diedTonightIds: new Set(['p1']),
      },
      catalog,
    )
    const ravenWake = ravenDiedTonight.find(
      (b) => b.kind === 'wake' && b.playerId === 'p1',
    )
    expect(ravenWake).toMatchObject({
      kind: 'wake',
      roleId: 'ravenkeeper',
      playerId: 'p1',
    })
  })

  it('keeps Scarlet Woman in other-night queue when alive', () => {
    const roster = players(7)
    const assignments: Record<string, Assignment> = {
      p1: assignment('p1', 'washerwoman'),
      p2: assignment('p2', 'librarian'),
      p3: assignment('p3', 'empath'),
      p4: assignment('p4', 'investigator'),
      p5: assignment('p5', 'chef'),
      p6: assignment('p6', 'scarletwoman'),
      p7: assignment('p7', 'imp'),
    }

    const beats = buildNightBeats(
      'other',
      {
        players: roster,
        assignments,
        deadPlayerIds: new Set(),
      },
      catalog,
    )

    expect(
      beats.some(
        (b) =>
          b.kind === 'wake' &&
          b.roleId === 'scarletwoman' &&
          b.playerId === 'p6',
      ),
    ).toBe(true)
  })
})
