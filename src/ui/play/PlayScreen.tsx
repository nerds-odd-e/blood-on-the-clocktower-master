import { Link } from 'react-router-dom'
import { buildNightBeats } from '../../domain/engine'
import { loadCatalog } from '../../domain/script'
import { useSetupSessionStore } from '../../state/setupSessionStore'

/**
 * Play landing — thin vertical slice: hydrate, re-derive beats, show current step.
 * Full coach chrome (Next / expand / bluffs) lands in later Phase 3 plans.
 */
export function PlayScreen() {
  const hasHydrated = useSetupSessionStore((state) => state.hasHydrated)
  const players = useSetupSessionStore((state) => state.players)
  const assignments = useSetupSessionStore((state) => state.assignments)
  const nightKind = useSetupSessionStore((state) => state.nightKind)
  const beatIndex = useSetupSessionStore((state) => state.beatIndex)
  const deadPlayerIds = useSetupSessionStore((state) => state.deadPlayerIds)
  const diedTonightIds = useSetupSessionStore((state) => state.diedTonightIds)
  const playStarted = useSetupSessionStore((state) => state.playStarted)

  if (!hasHydrated) {
    return (
      <div
        className="min-h-dvh bg-[var(--color-dominant)]"
        aria-busy="true"
        aria-label="Restoring play session"
      />
    )
  }

  const hasAssignments = Object.keys(assignments).length > 0
  if (!playStarted || !hasAssignments) {
    return (
      <section className="flex min-h-dvh flex-col gap-4 pt-8 pb-8">
        <h1 className="text-heading">Nothing to coach yet</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Record at least one role in setup, then start the first night again.
        </p>
        <Link
          to="/setup"
          className="text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
        >
          Back to setup
        </Link>
      </section>
    )
  }

  const catalog = loadCatalog()
  const beats = buildNightBeats(
    nightKind,
    {
      players,
      assignments,
      deadPlayerIds: new Set(deadPlayerIds),
      diedTonightIds: new Set(diedTonightIds),
    },
    catalog,
  )

  const total = beats.length
  const clampedIndex = Math.min(Math.max(beatIndex, 0), Math.max(total - 1, 0))
  const current = beats[clampedIndex]
  const stepLabel = nightKind === 'first' ? 'First night' : 'Other night'
  const nightMeta = `${stepLabel} · step ${clampedIndex + 1} of ${total}`

  return (
    <section className="flex min-h-dvh min-w-0 flex-col gap-4 overflow-x-hidden pt-8 pb-8">
      <p className="text-label text-[var(--color-text-muted)]">{nightMeta}</p>
      <h1 className="text-heading break-words">
        {current?.label ?? 'Nothing to coach yet'}
      </h1>
    </section>
  )
}
