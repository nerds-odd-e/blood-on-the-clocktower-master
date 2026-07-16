import type { LoadedCatalog } from '../script'
import type { BagPlan, BagValidation } from './types'

export function validateBag(
  plan: BagPlan,
  playerCount: number,
  catalog: LoadedCatalog,
): BagValidation {
  const issues: string[] = []
  const rolesById = new Map(catalog.roles.map((role) => [role.id, role]))
  const chart = catalog.setupChart.find(
    (row) => row.playerCount === playerCount,
  )

  if (!chart) issues.push(`No setup chart row for ${playerCount} players.`)
  if (plan.tokens.length !== playerCount) {
    issues.push(`Bag has ${plan.tokens.length} tokens; expected ${playerCount}.`)
  }
  if (plan.tokens.includes('drunk')) {
    issues.push('The Drunk character token cannot be placed in the bag.')
  }
  if (plan.tokens.filter((id) => id === 'imp').length !== 1) {
    issues.push('A Trouble Brewing bag must contain exactly one Imp.')
  }
  if (new Set(plan.tokens).size !== plan.tokens.length) {
    issues.push('Physical bag tokens must be unique.')
  }

  const physicalCounts = {
    townsfolk: 0,
    outsiders: 0,
    minions: 0,
    demons: 0,
  }
  for (const token of plan.tokens) {
    const role = rolesById.get(token)
    if (!role) {
      issues.push(`Unknown role token: ${token}.`)
      continue
    }
    if (role.team === 'townsfolk') physicalCounts.townsfolk += 1
    if (role.team === 'outsider') physicalCounts.outsiders += 1
    if (role.team === 'minion') physicalCounts.minions += 1
    if (role.team === 'demon') physicalCounts.demons += 1
  }

  if (plan.drunk) {
    const cover = rolesById.get(plan.drunk.coverRoleId)
    if (cover?.team !== 'townsfolk') {
      issues.push('The Drunk cover must be a Townsfolk role.')
    }
    if (plan.tokens.filter((id) => id === plan.drunk?.coverRoleId).length !== 1) {
      issues.push('The Drunk cover token must appear exactly once in the bag.')
    }
    physicalCounts.townsfolk -= 1
    physicalCounts.outsiders += 1
  }

  const compositionTotal = Object.values(plan.composition).reduce(
    (total, count) => total + count,
    0,
  )
  if (compositionTotal !== playerCount) {
    issues.push('True team composition does not sum to the player count.')
  }
  for (const team of ['townsfolk', 'outsiders', 'minions', 'demons'] as const) {
    if (physicalCounts[team] !== plan.composition[team]) {
      issues.push(`True ${team} count does not match the bag.`)
    }
  }

  if (chart) {
    const hasBaron = plan.tokens.includes('baron')
    const expected = {
      townsfolk: chart.townsfolk - (hasBaron ? 2 : 0),
      outsiders: chart.outsiders + (hasBaron ? 2 : 0),
      minions: chart.minions,
      demons: chart.demons,
    }
    for (const team of ['townsfolk', 'outsiders', 'minions', 'demons'] as const) {
      if (plan.composition[team] !== expected[team]) {
        issues.push(`Composition violates the setup chart for ${team}.`)
      }
    }
  }

  return { ok: issues.length === 0, issues }
}
