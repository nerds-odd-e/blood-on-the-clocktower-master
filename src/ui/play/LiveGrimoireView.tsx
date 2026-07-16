import { useState } from 'react'
import type { Assignment } from '../../domain/grimoire'
import type { LoadedCatalog, Role } from '../../domain/script'
import type { PersistWriteStatus } from '../../state/persistStatus'
import type { SetupPlayer } from '../../state/setupSessionStore'
import { BluffPicker } from './BluffPicker'

const TEAM_BADGE_CLASS: Record<Role['team'], string> = {
  townsfolk:
    'bg-[var(--color-team-townsfolk-bg)] text-[var(--color-team-townsfolk-fg)]',
  outsider:
    'bg-[var(--color-team-outsider-bg)] text-[var(--color-team-outsider-fg)]',
  minion:
    'bg-[var(--color-team-minion-bg)] text-[var(--color-team-minion-fg)]',
  demon: 'bg-[var(--color-team-demon-bg)] text-[var(--color-team-demon-fg)]',
}

type LiveGrimoireViewProps = {
  players: SetupPlayer[]
  assignments: Record<string, Assignment>
  catalog: LoadedCatalog
  deadPlayerIds: string[]
  reminders: Record<string, string[]>
  demonBluffs: string[]
  persistWriteStatus: PersistWriteStatus
  onToggleDead: (playerId: string) => void
  onSetPlayerReminders: (playerId: string, reminders: string[]) => void
  onToggleDemonBluff: (roleId: string) => void
  onBackToCoach: () => void
  onRetryPersist: () => void
}

function truthLabel(
  assignment: Assignment | undefined,
  roleById: Map<string, Role>,
): { primary: string; drunkCover?: string; team?: Role['team'] } {
  if (!assignment) {
    return { primary: 'Role not recorded' }
  }
  const truthId = assignment.trueRoleId ?? assignment.bagRoleId
  const truthRole = roleById.get(truthId)
  if (truthId === 'drunk') {
    const cover =
      roleById.get(assignment.believedRoleId ?? assignment.bagRoleId)?.name ??
      assignment.bagRoleId
    return {
      primary: 'Drunk',
      drunkCover: cover,
      team: truthRole?.team ?? 'outsider',
    }
  }
  return {
    primary: truthRole?.name ?? truthId,
    team: truthRole?.team,
  }
}

/**
 * Dedicated live grimoire: ST truth, Dead/Alive, reminder place/clear, bluff edit (D-13–D-16).
 */
export function LiveGrimoireView({
  players,
  assignments,
  catalog,
  deadPlayerIds,
  reminders,
  demonBluffs,
  persistWriteStatus,
  onToggleDead,
  onSetPlayerReminders,
  onToggleDemonBluff,
  onBackToCoach,
  onRetryPersist,
}: LiveGrimoireViewProps) {
  const [pickerPlayerId, setPickerPlayerId] = useState<string | null>(null)
  const roleById = new Map(catalog.roles.map((role) => [role.id, role]))
  const deadSet = new Set(deadPlayerIds)

  const pickerAssignment =
    pickerPlayerId != null ? assignments[pickerPlayerId] : undefined
  const pickerTruthId =
    pickerAssignment != null
      ? (pickerAssignment.trueRoleId ?? pickerAssignment.bagRoleId)
      : null
  const pickerRole =
    pickerTruthId != null ? roleById.get(pickerTruthId) : undefined
  const pickerCatalogReminders = pickerRole?.reminders ?? []
  const pickerPlaced = pickerPlayerId
    ? (reminders[pickerPlayerId] ?? [])
    : []
  const pickerPlayerName =
    players.find((player) => player.id === pickerPlayerId)?.name?.trim() ||
    'player'

  const placeOrClear = (playerId: string, token: string) => {
    const current = reminders[playerId] ?? []
    if (current.includes(token)) {
      onSetPlayerReminders(
        playerId,
        current.filter((entry) => entry !== token),
      )
      return
    }
    onSetPlayerReminders(playerId, [...current, token])
  }

  return (
    <section className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden pt-8 pb-8">
      <header className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-heading">Grimoire</h1>
          <p className="mt-1 text-label text-[var(--color-text-muted)]">
            Private — Storyteller only.
          </p>
        </div>
        <button
          type="button"
          className="min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          onClick={onBackToCoach}
        >
          Back to coach
        </button>
      </header>

      {persistWriteStatus === 'error' ? (
        <div
          className="mt-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          role="status"
        >
          <p className="text-body text-[var(--color-text-muted)]">
            Couldn’t save just now. Check storage, then try again — your last
            screen may still be in memory.
          </p>
          <button
            type="button"
            className="mt-3 min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={onRetryPersist}
          >
            Retry
          </button>
        </div>
      ) : null}

      {players.length === 0 ? (
        <p className="mt-8 text-body text-[var(--color-text-muted)]">
          No players seated
        </p>
      ) : (
        <ul className="mt-8 flex min-w-0 flex-col gap-4">
          {players.map((player) => {
            const assignment = assignments[player.id]
            const truth = truthLabel(assignment, roleById)
            const isDead = deadSet.has(player.id)
            const placed = reminders[player.id] ?? []
            const displayName = player.name.trim() || 'Unnamed player'

            return (
              <li
                key={player.id}
                data-testid="grimoire-player-row"
                data-player-id={player.id}
                data-dead={isDead ? 'true' : 'false'}
                className="min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
              >
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
                  <p className="text-body break-words text-[var(--color-text-primary)]">
                    {displayName}
                  </p>
                  {isDead ? (
                    <span className="text-label text-[var(--color-text-muted)]">
                      Dead
                    </span>
                  ) : null}
                </div>

                <div
                  className={`mt-2 flex min-w-0 flex-wrap items-center gap-2 ${
                    isDead ? 'opacity-40' : ''
                  }`}
                >
                  {truth.team ? (
                    <span
                      className={`rounded-sm px-2 py-1 text-label ${TEAM_BADGE_CLASS[truth.team]}`}
                    >
                      {truth.primary}
                    </span>
                  ) : (
                    <span className="text-body text-[var(--color-text-muted)]">
                      {truth.primary}
                    </span>
                  )}
                  {truth.drunkCover ? (
                    <span className="text-body text-[var(--color-text-muted)]">
                      Drunk · believes {truth.drunkCover}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    aria-pressed={!isDead}
                    className={`min-h-11 flex-1 rounded-sm border px-3 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${
                      !isDead
                        ? 'border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                    onClick={() => {
                      if (isDead) onToggleDead(player.id)
                    }}
                  >
                    Alive
                  </button>
                  <button
                    type="button"
                    aria-pressed={isDead}
                    className={`min-h-11 flex-1 rounded-sm border px-3 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${
                      isDead
                        ? 'border-[var(--color-text-primary)] text-[var(--color-text-primary)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}
                    onClick={() => {
                      if (!isDead) onToggleDead(player.id)
                    }}
                  >
                    Dead
                  </button>
                </div>

                <div className={`mt-3 min-w-0 ${isDead ? 'opacity-40' : ''}`}>
                  <p className="text-label text-[var(--color-text-muted)]">
                    Reminders
                  </p>
                  {placed.length > 0 ? (
                    <div className="mt-2 flex min-w-0 flex-wrap gap-1">
                      {placed.map((token) => (
                        <button
                          key={token}
                          type="button"
                          className="min-h-11 max-w-full break-words rounded-sm border border-[var(--color-border)] bg-[var(--color-dominant)] px-3 py-2 text-label text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
                          onClick={() => placeOrClear(player.id, token)}
                        >
                          {token}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="mt-2 min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
                    onClick={() =>
                      setPickerPlayerId((current) =>
                        current === player.id ? null : player.id,
                      )
                    }
                  >
                    Add reminder
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {pickerPlayerId ? (
        <section
          className="mt-6 min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          aria-label={`Reminders for ${pickerPlayerName}`}
        >
          <h2 className="text-heading">Reminders for {pickerPlayerName}</h2>
          {pickerCatalogReminders.length === 0 ? (
            <p className="mt-3 text-body text-[var(--color-text-muted)]">
              No reminder tokens for this character.
            </p>
          ) : (
            <div className="mt-3 flex min-w-0 flex-wrap gap-1">
              {pickerCatalogReminders.map((token) => {
                const isPlaced = pickerPlaced.includes(token)
                return (
                  <button
                    key={token}
                    type="button"
                    data-testid="reminder-chip"
                    aria-pressed={isPlaced}
                    className={`min-h-11 max-w-full break-words rounded-sm px-3 py-2 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${
                      isPlaced
                        ? 'bg-[var(--color-text-primary)] text-[var(--color-dominant)]'
                        : 'border border-[var(--color-border)] text-[var(--color-text-primary)]'
                    }`}
                    onClick={() => placeOrClear(pickerPlayerId, token)}
                  >
                    {token}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      ) : null}

      <div className="mt-12 min-w-0">
        {demonBluffs.length === 0 ? (
          <p className="mb-2 text-body text-[var(--color-text-muted)]">
            No bluffs recorded yet.
          </p>
        ) : null}
        <BluffPicker
          assignments={assignments}
          catalog={catalog}
          selected={demonBluffs}
          onToggle={onToggleDemonBluff}
        />
      </div>
    </section>
  )
}
