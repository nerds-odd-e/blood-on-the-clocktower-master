import type { AssignmentIssue, AssignmentSession } from './types'

function countRoles(roleIds: string[]) {
  const counts = new Map<string, number>()
  for (const roleId of roleIds) {
    counts.set(roleId, (counts.get(roleId) ?? 0) + 1)
  }
  return counts
}

function describeMismatch(
  expected: Map<string, number>,
  actual: Map<string, number>,
) {
  const roleIds = [...new Set([...expected.keys(), ...actual.keys()])].sort()
  const differences = roleIds
    .filter((roleId) => expected.get(roleId) !== actual.get(roleId))
    .map(
      (roleId) =>
        `${roleId}: expected ${expected.get(roleId) ?? 0}, recorded ${actual.get(roleId) ?? 0}`,
    )

  return differences.join('; ')
}

export function validateAssignments(
  session: AssignmentSession,
): AssignmentIssue[] {
  const issues: AssignmentIssue[] = []
  const playerIds = new Set(session.players.map((player) => player.id))
  const assignments = Object.values(session.assignments).filter((assignment) =>
    playerIds.has(assignment.playerId),
  )

  for (const player of session.players) {
    if (!session.assignments[player.id]) {
      issues.push({ code: 'unassigned', playerId: player.id })
    }
  }

  const expected = countRoles(session.bag.tokens)
  const actual = countRoles(assignments.map((assignment) => assignment.bagRoleId))

  for (const [roleId, count] of actual) {
    if (count > (expected.get(roleId) ?? 0)) {
      issues.push({ code: 'duplicate_token', roleId })
    }
  }

  const detail = describeMismatch(expected, actual)
  if (detail) {
    issues.push({ code: 'token_mismatch', detail })
  }

  return issues
}
