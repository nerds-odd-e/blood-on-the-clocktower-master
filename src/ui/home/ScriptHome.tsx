/**
 * Home composition: brand + Empty/Error panels.
 * Catalog wiring (loadCatalog → populated card + Start setup) lands in plan 01-03.
 * Copy from 01-UI-SPEC Copywriting Contract — React text children only.
 */
export function ScriptHome() {
  // Hook for plan 01-03: replace with loadCatalog() result.
  // Until then, expose Empty + Error panels so shell copy is verifiable.
  const catalogReady = false

  return (
    <section className="flex flex-col gap-8 pt-16 pb-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-display">Storyteller Copilot</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Helps you run Trouble Brewing — offline, on your phone.
        </p>
      </header>

      {!catalogReady ? (
        <div className="flex flex-col gap-6">
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

          <div
            className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
            role="alert"
          >
            <p className="text-body">
              Couldn’t read script data. Reload the app. If it keeps failing,
              reinstall after a network connection.
            </p>
          </div>
        </div>
      ) : null}

      {/* Start setup CTA lands with valid catalog in plan 01-03 */}
    </section>
  )
}
