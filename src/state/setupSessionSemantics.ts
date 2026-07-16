import { validateBag } from '../domain/bag'
import { eligibleBluffRoleIds } from '../domain/grimoire'
import type { LoadedCatalog } from '../domain/script'

/** Minimal shape for semantic checks; store Zod type stays authoritative for persistence. */
export type PersistedSetupSession = {
  wizardStep:
    | 'script'
    | 'players'
    | 'difficulty'
    | 'bag'
    | 'deal'
    | 'record'
    | 'nightReady'
  players: Array<{ id: string; name: string }>
  difficulty: 'easy' | 'standard' | 'hard'
  bag: {
    tokens: string[]
    composition: {
      townsfolk: number
      outsiders: number
      minions: number
      demons: number
    }
    drunk: { coverRoleId: string } | null
    setupNotes: string[]
    whyNote: string
  } | null
  assignments: Record<
    string,
    {
      playerId: string
      bagRoleId: string
      trueRoleId?: string
      believedRoleId?: string
    }
  >
  /** Play fields (persist v2). Optional so Phase 2-shaped fixtures still type-check. */
  nightKind?: 'first' | 'other'
  beatIndex?: number
  playSurface?: 'coach' | 'grimoire' | 'bridge'
  deadPlayerIds?: string[]
  reminders?: Record<string, string[]>
  demonBluffs?: string[]
  diedTonightIds?: string[]
  playStarted?: boolean
}

export type SemanticsResult = { ok: true } | { ok: false; reason: string }

const DOWNSTREAM_STEPS = new Set([
  'bag',
  'deal',
  'record',
  'nightReady',
] as const)

function fail(reason: string): SemanticsResult {
  return { ok: false, reason }
}

/**
 * Cross-field invariants after Zod shape parse (CR-01 / G-01).
 * Shape Zod stays separate — this catches impossible but shape-valid sessions.
 */
export function assertSetupSessionSemantics(
  session: PersistedSetupSession,
  catalog: LoadedCatalog,
): SemanticsResult {
  const { wizardStep, players, bag, assignments } = session
  const isDownstream = DOWNSTREAM_STEPS.has(
    wizardStep as 'bag' | 'deal' | 'record' | 'nightReady',
  )

  if (!isDownstream) {
    for (const [key, assignment] of Object.entries(assignments)) {
      if (key !== assignment.playerId) {
        return fail('Assignment key must equal assignment.playerId')
      }
    }
    return assertPlayFieldShapes(session)
  }

  if (players.length < 5 || players.length > 15) {
    return fail('Downstream steps require 5–15 players')
  }

  const ids = new Set<string>()
  const names = new Set<string>()
  for (const player of players) {
    if (ids.has(player.id)) return fail('Duplicate player id')
    ids.add(player.id)
    const trimmed = player.name.trim()
    if (!trimmed) return fail('Player name must be nonempty after trim')
    if (names.has(trimmed)) return fail('Duplicate trimmed player name')
    names.add(trimmed)
  }

  if (bag === null) {
    return fail('Downstream wizard steps require a bag')
  }

  if (bag.tokens.length !== players.length) {
    return fail('Bag token count must match player count')
  }

  const bagValidation = validateBag(bag, players.length, catalog)
  if (!bagValidation.ok) {
    return fail(bagValidation.issues[0] ?? 'Bag failed validateBag')
  }

  const tokenCounts = new Map<string, number>()
  for (const roleId of bag.tokens) {
    tokenCounts.set(roleId, (tokenCounts.get(roleId) ?? 0) + 1)
  }

  for (const [key, assignment] of Object.entries(assignments)) {
    if (key !== assignment.playerId) {
      return fail('Assignment key must equal assignment.playerId')
    }
    if (!ids.has(assignment.playerId)) {
      return fail('Assignment references unknown player')
    }

    const remaining = tokenCounts.get(assignment.bagRoleId) ?? 0
    if (remaining <= 0) {
      return fail('Assignment bagRoleId is not among bag tokens')
    }
    tokenCounts.set(assignment.bagRoleId, remaining - 1)

    const isDrunkCover =
      bag.drunk != null && assignment.bagRoleId === bag.drunk.coverRoleId
    if (isDrunkCover) {
      if (assignment.trueRoleId !== 'drunk') {
        return fail('Drunk cover assignment must set trueRoleId to drunk')
      }
    } else if (assignment.trueRoleId === 'drunk') {
      return fail('trueRoleId drunk requires the Drunk cover bag token')
    }
  }

  const playShape = assertPlayFieldShapes(session)
  if (!playShape.ok) return playShape

  const bluffEligibility = assertDemonBluffEligibility(session, catalog)
  if (!bluffEligibility.ok) return bluffEligibility

  return { ok: true }
}

/** demonBluffs ⊆ eligibleBluffRoleIds when assignments are present (T-03-01). */
function assertDemonBluffEligibility(
  session: PersistedSetupSession,
  catalog: LoadedCatalog,
): SemanticsResult {
  if (session.demonBluffs === undefined) return { ok: true }
  if (Object.keys(session.assignments).length === 0) return { ok: true }

  const eligible = new Set(eligibleBluffRoleIds(session.assignments, catalog))
  for (const id of session.demonBluffs) {
    if (!eligible.has(id)) {
      return fail('demonBluffs contains an ineligible role id')
    }
  }
  return { ok: true }
}

/** Light shape checks for persist-v2 play arrays (eligibility waits for 03-04). */
function assertPlayFieldShapes(session: PersistedSetupSession): SemanticsResult {
  if (session.deadPlayerIds !== undefined) {
    if (!Array.isArray(session.deadPlayerIds)) {
      return fail('deadPlayerIds must be an array')
    }
    for (const id of session.deadPlayerIds) {
      if (typeof id !== 'string' || id.length === 0) {
        return fail('deadPlayerIds entries must be nonempty strings')
      }
    }
  }
  if (session.diedTonightIds !== undefined) {
    if (!Array.isArray(session.diedTonightIds)) {
      return fail('diedTonightIds must be an array')
    }
    for (const id of session.diedTonightIds) {
      if (typeof id !== 'string' || id.length === 0) {
        return fail('diedTonightIds entries must be nonempty strings')
      }
    }
  }
  if (session.demonBluffs !== undefined) {
    if (!Array.isArray(session.demonBluffs)) {
      return fail('demonBluffs must be an array')
    }
    if (session.demonBluffs.length > 3) {
      return fail('demonBluffs must contain at most 3 role ids')
    }
    for (const id of session.demonBluffs) {
      if (typeof id !== 'string' || id.length === 0) {
        return fail('demonBluffs entries must be nonempty strings')
      }
    }
  }
  if (session.reminders !== undefined) {
    if (
      typeof session.reminders !== 'object' ||
      session.reminders === null ||
      Array.isArray(session.reminders)
    ) {
      return fail('reminders must be a record of string arrays')
    }
    for (const tokens of Object.values(session.reminders)) {
      if (!Array.isArray(tokens)) {
        return fail('reminders values must be string arrays')
      }
    }
  }
  if (
    session.beatIndex !== undefined &&
    (!Number.isInteger(session.beatIndex) || session.beatIndex < 0)
  ) {
    return fail('beatIndex must be a nonnegative integer')
  }
  return { ok: true }
}
