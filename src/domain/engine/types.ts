import type { Assignment } from '../grimoire'
import type { LoadedCatalog } from '../script'

export type NightKind = 'first' | 'other'

export type ProcedureBeatId = 'dusk' | 'minion-info' | 'demon-info' | 'dawn'

export type Beat =
  | { kind: 'procedure'; id: ProcedureBeatId; label: string }
  | { kind: 'wake'; id: string; roleId: string; playerId: string; label: string }

export type BuildNightBeatsInput = {
  players: { id: string; name: string }[]
  assignments: Record<string, Assignment>
  deadPlayerIds: Set<string>
  diedTonightIds?: Set<string>
}

export type BuildNightBeatsCatalog = LoadedCatalog
