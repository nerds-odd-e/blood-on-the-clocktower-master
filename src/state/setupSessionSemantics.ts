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

/** Stub — Task 1 RED; real invariants land in GREEN. */
export function assertSetupSessionSemantics(
  _session: PersistedSetupSession,
  _catalog: LoadedCatalog,
): SemanticsResult {
  return { ok: true }
}
