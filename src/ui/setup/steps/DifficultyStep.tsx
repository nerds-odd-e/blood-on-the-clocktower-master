import {
  useSetupSessionStore,
  type Difficulty,
} from '../../../state/setupSessionStore'

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'standard', label: 'Standard' },
  { value: 'hard', label: 'Hard' },
]

export function DifficultyStep() {
  const difficulty = useSetupSessionStore((state) => state.difficulty)
  const setDifficulty = useSetupSessionStore((state) => state.setDifficulty)
  const setWizardStep = useSetupSessionStore((state) => state.setWizardStep)

  return (
    <section className="flex min-h-dvh flex-col gap-8 pt-8 pb-28">
      <header className="flex flex-col gap-2">
        <p className="text-label text-[var(--color-text-muted)]">Step 3 of 6</p>
        <h1 className="text-heading">Difficulty</h1>
      </header>
      <div>
        <div className="grid grid-cols-3 gap-2" aria-label="Difficulty">
          {difficulties.map((option) => {
            const selected = difficulty === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                className={`min-h-12 rounded-sm border px-2 text-body font-semibold ${
                  selected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[#0B0B0B]'
                    : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-primary)]'
                }`}
                onClick={() => setDifficulty(option.value)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-body text-[var(--color-text-muted)]">
          Changes which legal bags are preferred — not who draws what.
        </p>
      </div>
      <footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
        <button
          type="button"
          className="min-h-11 self-start text-body underline underline-offset-4"
          onClick={() => setWizardStep('players')}
        >
          Back
        </button>
        <button
          type="button"
          className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B]"
          onClick={() => setWizardStep('bag')}
        >
          Next step
        </button>
      </footer>
    </section>
  )
}
