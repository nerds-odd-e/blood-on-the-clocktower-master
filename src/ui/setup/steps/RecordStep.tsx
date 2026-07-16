import { loadCatalog } from '../../../domain/script'
import {
  validateAssignments,
  type AssignmentIssue,
} from '../../../domain/grimoire'
import {
  remainingTokens,
  useSetupSessionStore,
} from '../../../state/setupSessionStore'
import { RolePicker } from '../components/RolePicker'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useState } from 'react'

type RecordStepProps = {
  onBack: () => void
  onStartNight: () => void
}

export function RecordStep({ onBack, onStartNight }: RecordStepProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [startIssues, setStartIssues] = useState<AssignmentIssue[] | null>(null)
  const players = useSetupSessionStore((state) => state.players)
  const bag = useSetupSessionStore((state) => state.bag)
  const assignments = useSetupSessionStore((state) => state.assignments)
  const assignRole = useSetupSessionStore((state) => state.assignRole)
  const clearRole = useSetupSessionStore((state) => state.clearRole)
  const roles = loadCatalog().roles
  const roleById = new Map(roles.map((role) => [role.id, role]))
  const selectedAssignment = selectedPlayerId
    ? assignments[selectedPlayerId]
    : undefined

  const describeIssue = (issue: AssignmentIssue) => {
    if (issue.code === 'unassigned') {
      const player = players.find((candidate) => candidate.id === issue.playerId)
      return `${player?.name || 'A player'} has no character yet.`
    }
    if (issue.code === 'duplicate_token') {
      const role = roleById.get(issue.roleId)
      return `${role?.name ?? issue.roleId} is assigned more than once.`
    }
    return `Recorded roles do not match the bag (${issue.detail}).`
  }

  return (
    <section className="flex flex-col gap-6 pt-8 pb-8">
      <div>
        <p className="text-label text-[var(--color-text-muted)]">Step 6 of 6</p>
        <h1 className="mt-1 text-heading">Record roles</h1>
        <p className="mt-2 text-body text-[var(--color-text-muted)]">
          Tap a player, then pick the character they drew. Fix mistakes anytime.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {players.map((player) => {
          const assignment = assignments[player.id]
          return (
            <button
              key={player.id}
              type="button"
              className={`min-h-14 w-full rounded-sm border bg-[var(--color-secondary)] p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${
                assignment
                  ? 'border-l-2 border-[var(--color-accent)]'
                  : 'border-[var(--color-border)]'
              }`}
              data-testid="setup-player-row"
              data-role-id={assignment?.bagRoleId}
              aria-pressed={selectedPlayerId === player.id}
              onClick={() => setSelectedPlayerId(player.id)}
            >
              <span className="block text-body">{player.name}</span>
              <span className="mt-1 block text-label text-[var(--color-text-muted)]">
                {assignment
                  ? roleById.get(assignment.bagRoleId)?.name ??
                    assignment.bagRoleId
                  : 'Not recorded yet'}
              </span>
            </button>
          )
        })}
      </div>

      {selectedPlayerId ? (
        <RolePicker
          remaining={remainingTokens(bag, assignments)}
          roles={roles}
          canClear={selectedAssignment !== undefined}
          onAssign={(roleId) => {
            assignRole(selectedPlayerId, roleId)
            setSelectedPlayerId(null)
          }}
          onClear={() => {
            clearRole(selectedPlayerId)
            setSelectedPlayerId(null)
          }}
        />
      ) : null}

      <footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
        <button
          type="button"
          className="min-h-11 self-start text-body underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          onClick={() => {
            if (!bag) return
            const issues = validateAssignments({ players, bag, assignments })
            if (issues.length > 0) {
              setStartIssues(issues)
              return
            }
            onStartNight()
          }}
        >
          Start night
        </button>
      </footer>

      {startIssues ? (
        <ConfirmDialog
          title="Recording is incomplete"
          confirmLabel="Start anyway"
          dismissLabel="Keep recording"
          secondaryConfirm
          onConfirm={() => {
            setStartIssues(null)
            onStartNight()
          }}
          onDismiss={() => setStartIssues(null)}
        >
          <p>You can still start night, but fix these if you can:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {startIssues.map((issue, index) => (
              <li key={`${issue.code}-${index}`}>{describeIssue(issue)}</li>
            ))}
          </ul>
        </ConfirmDialog>
      ) : null}
    </section>
  )
}
