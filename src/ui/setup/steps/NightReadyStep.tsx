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

  if (!bag) return null

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
  ]

  return (
    <section className="flex min-h-dvh flex-col gap-6 pt-8 pb-8">
      <header>
        <h1 className="text-display">Night ready</h1>
        <p className="mt-3 text-body text-[var(--color-text-muted)]">
          Assignments are saved. Night coaching arrives in the next update — stay
          ready at the table.
        </p>
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
