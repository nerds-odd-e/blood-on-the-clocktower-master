import type { BagPlan } from '../bag'

export type Assignment = {
  playerId: string
  bagRoleId: string
  trueRoleId?: string
  believedRoleId?: string
}

export type AssignmentIssue =
  | { code: 'unassigned'; playerId: string }
  | { code: 'token_mismatch'; detail: string }
  | { code: 'duplicate_token'; roleId: string }

export type AssignmentSession = {
  players: { id: string }[]
  bag: BagPlan
  assignments: Record<string, Assignment>
}
