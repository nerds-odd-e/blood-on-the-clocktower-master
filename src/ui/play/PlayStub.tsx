import { Link } from 'react-router-dom'

/**
 * Play stub — night coach lands after setup.
 * Copy from 01-UI-SPEC Copywriting Contract.
 */
export function PlayStub() {
  return (
    <section className="flex flex-col gap-4 pt-8 pb-8">
      <h1 className="text-heading">Play</h1>
      <p className="text-body text-[var(--color-text-muted)]">
        Night coach comes after setup.
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
