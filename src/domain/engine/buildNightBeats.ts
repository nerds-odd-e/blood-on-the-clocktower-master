import type { Assignment } from '../grimoire'
import type { LoadedCatalog } from '../script'
import type { Beat, BuildNightBeatsInput, NightKind } from './types'

/** Role the player wakes as (Drunk uses believed Townsfolk cover). */
export function wakeRoleId(assignment: Assignment): string {
  return (
    assignment.believedRoleId ??
    assignment.trueRoleId ??
    assignment.bagRoleId
  )
}

/** True grimoire identity for team presence (Drunk stays Drunk). */
function truthRoleId(assignment: Assignment): string {
  return assignment.trueRoleId ?? assignment.bagRoleId
}

export function buildNightBeats(
  nightKind: NightKind,
  input: BuildNightBeatsInput,
  catalog: LoadedCatalog,
): Beat[] {
  const roleById = new Map(catalog.roles.map((role) => [role.id, role]))
  const playerCount = input.players.length
  const recorded = Object.values(input.assignments)
  const diedTonight = input.diedTonightIds ?? new Set<string>()

  const hasMinion = recorded.some(
    (a) => roleById.get(truthRoleId(a))?.team === 'minion',
  )
  const hasDemon = recorded.some(
    (a) => roleById.get(truthRoleId(a))?.team === 'demon',
  )

  const beats: Beat[] = [{ kind: 'procedure', id: 'dusk', label: 'Dusk' }]

  if (nightKind === 'first' && playerCount >= 7) {
    if (hasMinion) {
      beats.push({ kind: 'procedure', id: 'minion-info', label: 'Minion Info' })
    }
    if (hasDemon) {
      beats.push({ kind: 'procedure', id: 'demon-info', label: 'Demon Info' })
    }
  }

  const ordinalKey = nightKind === 'first' ? 'firstNight' : 'otherNight'

  const wakes = recorded
    .map((assignment) => {
      const roleId = wakeRoleId(assignment)
      const role = roleById.get(roleId)
      if (!role || role[ordinalKey] <= 0) return null

      if (nightKind === 'other' && input.deadPlayerIds.has(assignment.playerId)) {
        // A1: Ravenkeeper wakes only when they died tonight
        if (roleId !== 'ravenkeeper' || !diedTonight.has(assignment.playerId)) {
          return null
        }
      }

      return { assignment, role }
    })
    .filter(
      (item): item is NonNullable<typeof item> => item !== null,
    )
    .sort((a, b) => a.role[ordinalKey] - b.role[ordinalKey])

  for (const { assignment, role } of wakes) {
    beats.push({
      kind: 'wake',
      id: `wake:${assignment.playerId}:${role.id}`,
      roleId: role.id,
      playerId: assignment.playerId,
      label: role.name,
    })
  }

  beats.push({ kind: 'procedure', id: 'dawn', label: 'Dawn' })
  return beats
}
