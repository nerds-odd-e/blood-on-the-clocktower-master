import type { Beat, NightKind } from '../engine'
import type { CoachCopyEntry, LoadedCatalog } from '../script'

export type ComposePromptContext = {
  nightKind: NightKind
  catalog: LoadedCatalog
  playerName?: string
}

export type ComposedPrompt = {
  short: string
  detail: string
}

const ST_JUDGES =
  'ST judges the answer — this app does not auto-resolve.'

function substitute(
  template: string,
  vars: { Role?: string; Name?: string },
): string {
  return template
    .replaceAll('{Role}', vars.Role ?? '')
    .replaceAll('{Name}', vars.Name ?? '')
}

function pickEntry(
  entries: CoachCopyEntry[],
  id: string,
  nightKind: NightKind,
): CoachCopyEntry | undefined {
  const candidates = entries.filter((entry) => entry.id === id)
  return (
    candidates.find((entry) => entry.nightKind === nightKind) ??
    candidates.find((entry) => entry.nightKind == null)
  )
}

function roleReminder(
  catalog: LoadedCatalog,
  roleId: string,
  nightKind: NightKind,
): string {
  const role = catalog.roles.find((candidate) => candidate.id === roleId)
  if (!role) return ''
  return nightKind === 'first'
    ? role.firstNightReminder
    : role.otherNightReminder
}

function procedureFallback(
  catalog: LoadedCatalog,
  id: string,
): ComposedPrompt {
  const beat = catalog.proceduralBeats.find((candidate) => candidate.id === id)
  const notes = beat?.notes?.trim() || `Continue with ${beat?.label ?? id}.`
  return {
    short: notes,
    detail: notes,
  }
}

function wakeFallback(
  catalog: LoadedCatalog,
  roleId: string,
  roleName: string,
  nightKind: NightKind,
): ComposedPrompt {
  const reminder = roleReminder(catalog, roleId, nightKind).trim()
  const short = `Wake ${roleName}. Follow the short procedure, then put them back to sleep.`
  if (reminder) {
    return {
      short,
      detail: `${reminder} ${ST_JUDGES}`,
    }
  }
  return {
    short,
    detail: ST_JUDGES,
  }
}

/**
 * Build short + detail coach prompts for a night beat.
 * Prefers paraphrased coach-copy.json; falls back to catalog reminders / notes.
 */
export function composePrompt(
  beat: Beat,
  ctx: ComposePromptContext,
): ComposedPrompt {
  const { nightKind, catalog, playerName } = ctx
  const roleName =
    beat.kind === 'wake'
      ? (catalog.roles.find((role) => role.id === beat.roleId)?.name ??
        beat.label)
      : beat.label

  const vars = {
    Role: roleName,
    Name: playerName ?? '',
  }

  if (beat.kind === 'procedure') {
    const entry = pickEntry(catalog.coachCopy, beat.id, nightKind)
    if (entry) {
      return {
        short: substitute(entry.short, vars),
        detail: substitute(entry.detail, vars),
      }
    }
    return procedureFallback(catalog, beat.id)
  }

  const entry = pickEntry(catalog.coachCopy, `wake:${beat.roleId}`, nightKind)
  if (entry) {
    return {
      short: substitute(entry.short, vars),
      detail: substitute(entry.detail, vars),
    }
  }

  return wakeFallback(catalog, beat.roleId, roleName, nightKind)
}
