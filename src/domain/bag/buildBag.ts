import type { Role } from '../script'
import { pickWeightedRoles, WHY_NOTE } from './heuristics'
import type { BagPlan, BuildBagInput } from './types'
import { validateBag } from './validateBag'

const MAX_BUILD_ATTEMPTS = 5

function cryptoRng(): number {
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0] / 0x1_0000_0000
}

function rolesForTeam(roles: Role[], team: Role['team']): Role[] {
  return roles.filter((role) => role.team === team)
}

function createCandidate({
  playerCount,
  difficulty,
  catalog,
  rng,
}: Required<BuildBagInput>): BagPlan {
  const chart = catalog.setupChart.find(
    (row) => row.playerCount === playerCount,
  )
  if (!chart) {
    throw new Error(`No Trouble Brewing setup chart row for ${playerCount} players.`)
  }

  const demons = rolesForTeam(catalog.roles, 'demon').filter(
    (role) => role.id === 'imp',
  )
  if (demons.length !== 1 || chart.demons !== 1) {
    throw new Error('Trouble Brewing requires exactly one Imp.')
  }

  const minions = pickWeightedRoles(
    rolesForTeam(catalog.roles, 'minion'),
    chart.minions,
    difficulty,
    rng,
  )
  const hasBaron = minions.some((role) => role.id === 'baron')
  const composition = {
    townsfolk: chart.townsfolk - (hasBaron ? 2 : 0),
    outsiders: chart.outsiders + (hasBaron ? 2 : 0),
    minions: chart.minions,
    demons: chart.demons,
  }
  if (composition.townsfolk < 0) {
    throw new Error('Baron setup would require a negative Townsfolk count.')
  }

  const outsiders = pickWeightedRoles(
    rolesForTeam(catalog.roles, 'outsider'),
    composition.outsiders,
    difficulty,
    rng,
  )
  const hasDrunk = outsiders.some((role) => role.id === 'drunk')
  const townsfolk = pickWeightedRoles(
    rolesForTeam(catalog.roles, 'townsfolk'),
    composition.townsfolk + (hasDrunk ? 1 : 0),
    difficulty,
    rng,
  )
  const coverRole = hasDrunk ? townsfolk[townsfolk.length - 1] : null
  const tokens = [
    ...townsfolk.map((role) => role.id),
    ...outsiders.filter((role) => role.id !== 'drunk').map((role) => role.id),
    ...minions.map((role) => role.id),
    'imp',
  ]
  const setupNotes: string[] = []
  if (hasBaron) {
    setupNotes.push('Baron: add 2 Outsiders and remove 2 Townsfolk.')
  }
  if (coverRole) {
    setupNotes.push('One Townsfolk token is the Drunk.')
  }

  return {
    tokens,
    composition,
    drunk: coverRole ? { coverRoleId: coverRole.id } : null,
    setupNotes,
    whyNote: WHY_NOTE[difficulty],
  }
}

export function buildBag(input: BuildBagInput): BagPlan {
  const rng = input.rng ?? cryptoRng
  let lastIssues: string[] = []
  for (let attempt = 0; attempt < MAX_BUILD_ATTEMPTS; attempt += 1) {
    const plan = createCandidate({ ...input, rng })
    const validation = validateBag(plan, input.playerCount, input.catalog)
    if (validation.ok) return plan
    lastIssues = validation.issues
  }
  throw new Error(`Could not build a legal bag: ${lastIssues.join(' ')}`)
}
