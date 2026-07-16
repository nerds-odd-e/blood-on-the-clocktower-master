import { loadCatalog } from '../../../domain/script'
import { useSetupSessionStore } from '../../../state/setupSessionStore'

type NightReadyStepProps = {
  onBack: () => void
}

const DIFFICULTY_LABEL = {
  easy: 'Easy',
  standard: 'Standard',
  hard: 'Hard',
} as const

export function NightReadyStep({ onBack }: NightReadyStepProps) {
  const players = useSetupSessionStore((state) => state.players)
  const difficulty = useSetupSessionStore((state) => state.difficulty)
  const bag = useSetupSessionStore((state) => state.bag)
  const assignments = useSetupSessionStore((state) => state.assignments)
  const persistWriteStatus = useSetupSessionStore(
    (state) => state.persistWriteStatus,
  )
  const retryCriticalPersist = useSetupSessionStore(
    (state) => state.retryCriticalPersist,
  )

  if (!bag) return null

  const roleById = new Map(
    loadCatalog().roles.map((role) => [role.id, role]),
  )
  const drunkAssignment = Object.values(assignments).find(
    (assignment) => assignment.trueRoleId === 'drunk',
  )
  const drunkPlayer = drunkAssignment
    ? players.find((player) => player.id === drunkAssignment.playerId)
    : undefined
  const drunkCoverName =
    drunkAssignment != null
      ? (roleById.get(drunkAssignment.bagRoleId)?.name ??
        drunkAssignment.bagRoleId)
      : null

  const summary = [
    { label: 'Players', value: String(players.length) },
    { label: 'Difficulty', value: DIFFICULTY_LABEL[difficulty] },
    {
      label: 'Bag',
      value: `${bag.composition.townsfolk} TF · ${bag.composition.outsiders} Out · ${bag.composition.minions} Min · ${bag.composition.demons} Dem`,
    },
    {
      label: 'Assignments',
      value: `${Object.keys(assignments).length} recorded`,
    },
    ...(drunkAssignment && drunkCoverName
      ? [
          {
            label: 'Drunk',
            value: `${drunkPlayer?.name || 'A player'} believes ${drunkCoverName}`,
          },
        ]
      : []),
  ]

  const statusCopy =
    persistWriteStatus === 'saved'
      ? 'Assignments are saved. Night coaching arrives in the next update — stay ready at the table.'
      : persistWriteStatus === 'saving'
        ? 'Saving your assignments… keep this screen open for a moment.'
        : 'Couldn’t save your assignments on this device. Check storage, then try again — nothing here blames you.'

  return (
    <section className="flex min-h-dvh flex-col gap-6 pt-8 pb-8">
      <header>
        <h1 className="text-display">Night ready</h1>
        <p className="mt-3 text-body text-[var(--color-text-muted)]">
          {statusCopy}
        </p>
        {persistWriteStatus === 'error' ? (
          <button
            type="button"
            className="mt-4 min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            onClick={() => {
              void retryCriticalPersist()
            }}
          >
            Retry
          </button>
        ) : null}
      </header>

      <dl className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 border-b border-[var(--color-border)] py-3 first:pt-0 last:border-b-0 last:pb-0"
          >
            <dt className="text-label text-[var(--color-text-muted)]">
              {item.label}
            </dt>
            <dd className="min-w-0 text-right text-body break-words">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        className="min-h-11 self-start text-body underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
        onClick={onBack}
      >
        Back
      </button>
    </section>
  )
}
