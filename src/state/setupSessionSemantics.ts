import { validateBag } from '../domain/bag'
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
    return { ok: true }
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

  for (const [key, assignment] of Object.entries(assignments)) {
    if (key !== assignment.playerId) {
      return fail('Assignment key must equal assignment.playerId')
    }
    if (!ids.has(assignment.playerId)) {
      return fail('Assignment references unknown player')
    }
  }

  return { ok: true }
}
