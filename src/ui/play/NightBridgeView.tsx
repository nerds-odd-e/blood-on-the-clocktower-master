import type { NightKind } from '../../state/setupSessionStore'

type NightBridgeViewProps = {
  nightKind: NightKind
  onStartOtherNight: () => void
  onOpenGrimoire: () => void
}

/**
 * End-of-night bridge — Night complete → Start other night (D-06). No day-phase chrome.
 */
export function NightBridgeView({
  nightKind,
  onStartOtherNight,
  onOpenGrimoire,
}: NightBridgeViewProps) {
  const body =
    nightKind === 'first'
      ? 'First night is done. When you are ready for the next night, continue — there is no day-phase tracker in this version.'
      : 'Night is done. Start the next other night when the table is ready.'

  return (
    <section className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden pt-16 pb-8">
      <header className="flex min-w-0 flex-wrap items-baseline justify-end gap-x-4 gap-y-2">
        <button
          type="button"
          className="min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          onClick={onOpenGrimoire}
        >
          Grimoire
        </button>
      </header>

      <div className="mt-8 flex min-w-0 flex-1 flex-col">
        <h1 className="text-display">Night complete</h1>
        <p className="mt-4 text-body text-[var(--color-text-muted)]">{body}</p>
      </div>

      <footer className="sticky bottom-0 mt-auto bg-[var(--color-dominant)] py-4">
        <button
          type="button"
          className="min-h-12 w-full rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          onClick={onStartOtherNight}
        >
          Start other night
        </button>
      </footer>
    </section>
  )
}
