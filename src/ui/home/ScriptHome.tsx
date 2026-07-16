import { Link } from 'react-router-dom'
import { loadCatalog, type TroubleBrewingCatalog } from '../../domain/script'

type CatalogView =
  | { status: 'ok'; catalog: TroubleBrewingCatalog }
  | { status: 'empty' }
  | { status: 'error' }

function readCatalog(): CatalogView {
  try {
    const catalog = loadCatalog()
    // Zero-script / empty payload → Empty state (fail-soft); Zod length gates usual path.
    if (catalog.roles.length === 0) {
      return { status: 'empty' }
    }
    return { status: 'ok', catalog }
  } catch {
    return { status: 'error' }
  }
}

/**
 * Home composition: brand + TB catalog card (or Empty/Error).
 * Copy from 01-UI-SPEC Copywriting Contract — React text children only (T-01-01).
 * Offline ready chip is optimistic on valid catalog (D-01 D-02 D-03) — not SW-gated.
 */
export function ScriptHome() {
  const view = readCatalog()

  return (
    <section className="flex flex-col gap-8 pt-16 pb-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-display">Storyteller Copilot</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Helps you run Trouble Brewing — offline, on your phone.
        </p>
      </header>

      {view.status === 'empty' ? (
        <div
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          role="status"
        >
          <h2 className="text-heading">No scripts loaded</h2>
          <p className="mt-2 text-body text-[var(--color-text-muted)]">
            Trouble Brewing data did not load. Reinstall or reload the app
            after connecting once.
          </p>
        </div>
      ) : null}

      {view.status === 'error' ? (
        <div
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          role="alert"
        >
          <p className="text-body">
            Couldn’t read script data. Reload the app. If it keeps failing,
            reinstall after a network connection.
          </p>
        </div>
      ) : null}

      {view.status === 'ok' ? (
        <div className="flex flex-col gap-6">
          <article
            className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
            aria-label="Trouble Brewing script"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-heading">Trouble Brewing</h2>
              <span className="text-label text-[var(--color-text-muted)]">
                Available
              </span>
              <span
                className="text-label rounded-sm border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text-muted)]"
                data-testid="offline-ready"
              >
                Offline ready
              </span>
            </div>
            <p className="mt-2 text-label text-[var(--color-text-muted)]">
              22 roles · setup chart · night order
            </p>
          </article>

          <Link
            to="/setup"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Start setup
          </Link>
        </div>
      ) : null}
    </section>
  )
}
