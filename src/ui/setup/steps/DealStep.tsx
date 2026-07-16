type DealStepProps = {
  onBack: () => void
  onContinue: () => void
}

export function DealStep({ onBack, onContinue }: DealStepProps) {
  return (
    <section className="flex flex-col gap-6 pt-8 pb-8">
      <div>
        <p className="text-label text-[var(--color-text-muted)]">Step 5 of 6</p>
        <h1 className="mt-1 text-heading">Deal</h1>
      </div>

      <div className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4">
        <p className="text-body">
          Shuffle the bag and deal one face-down token to each player in seat
          order. When everyone has a token, continue and record who got what.
        </p>
      </div>

      <div className="flex flex-col gap-3">
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
          onClick={onContinue}
        >
          Continue to record
        </button>
      </div>
    </section>
  )
}
