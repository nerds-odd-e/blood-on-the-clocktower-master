import { Link } from 'react-router-dom'

/**
 * Setup stub — real wizard lands in Phase 2.
 * Copy from 01-UI-SPEC Copywriting Contract.
 */
export function SetupStub() {
  return (
    <section className="flex flex-col gap-4 pt-8 pb-8">
      <h1 className="text-heading">Setup</h1>
      <p className="text-body text-[var(--color-text-muted)]">
        Setup wizard comes in the next phase.
      </p>
      <Link
        to="/"
        className="text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
      >
        Back to home
      </Link>
    </section>
  )
}
