import type { LoadedCatalog } from '../script'
import type { Assignment } from './types'

/**
 * Townsfolk/Outsider role ids that are not seated (true or bag cover).
 * Never includes Minion/Demon. Drunk cover bagRoleId counts as in-play.
 */
export function eligibleBluffRoleIds(
  assignments: Record<string, Assignment>,
  catalog: LoadedCatalog,
): string[] {
  const inPlay = new Set<string>()
  for (const assignment of Object.values(assignments)) {
    inPlay.add(assignment.trueRoleId ?? assignment.bagRoleId)
    inPlay.add(assignment.bagRoleId)
  }
  return catalog.roles
    .filter(
      (role) =>
        (role.team === 'townsfolk' || role.team === 'outsider') &&
        !inPlay.has(role.id),
    )
    .map((role) => role.id)
}
