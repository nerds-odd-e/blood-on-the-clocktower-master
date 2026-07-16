import { Link } from 'react-router-dom'

export function ScriptStep({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="flex min-h-dvh flex-col gap-8 pt-8 pb-28">
      <header className="flex flex-col gap-2">
        <p className="text-label text-[var(--color-text-muted)]">Step 1 of 6</p>
        <h1 className="text-heading">Trouble Brewing</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Confirm this script, then add your players.
        </p>
      </header>
      <article className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4">
        <p className="text-heading">Trouble Brewing</p>
        <p className="mt-2 text-body text-[var(--color-text-muted)]">
          Only script available in this version.
        </p>
      </article>
      <footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center text-body underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
        >
          Back to home
        </Link>
        <button
          type="button"
          className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          onClick={onContinue}
        >
          Continue setup
        </button>
      </footer>
    </section>
  )
}
