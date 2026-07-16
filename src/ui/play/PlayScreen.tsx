import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { buildNightBeats } from '../../domain/engine'
import { loadCatalog } from '../../domain/script'
import { useSetupSessionStore } from '../../state/setupSessionStore'
import { CoachBeatView } from './CoachBeatView'

/**
 * Play shell — coach / grimoire / bridge via playSurface (D-01).
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
  const playSurface = useSetupSessionStore((state) => state.playSurface)
  const persistWriteStatus = useSetupSessionStore(
    (state) => state.persistWriteStatus,
  )
  const advanceBeat = useSetupSessionStore((state) => state.advanceBeat)
  const retreatBeat = useSetupSessionStore((state) => state.retreatBeat)
  const clampBeatIndex = useSetupSessionStore((state) => state.clampBeatIndex)
  const setPlaySurface = useSetupSessionStore((state) => state.setPlaySurface)
  const retryCriticalPersist = useSetupSessionStore(
    (state) => state.retryCriticalPersist,
  )

  const catalog = loadCatalog()
  const hasAssignments = Object.keys(assignments).length > 0
  const beats =
    playStarted && hasAssignments
      ? buildNightBeats(
          nightKind,
          {
            players,
            assignments,
            deadPlayerIds: new Set(deadPlayerIds),
            diedTonightIds: new Set(diedTonightIds),
          },
          catalog,
        )
      : []

  useEffect(() => {
    if (!playStarted || !hasAssignments) return
    clampBeatIndex(beats.length)
  }, [playStarted, hasAssignments, beats.length, clampBeatIndex])

  if (!hasHydrated) {
    return (
      <div
        className="min-h-dvh bg-[var(--color-dominant)]"
        aria-busy="true"
        aria-label="Restoring play session"
      />
    )
  }

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

  if (beats.length === 0) {
    return (
      <section className="flex min-h-dvh min-w-0 flex-col gap-4 overflow-x-hidden pt-8 pb-8">
        <header className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="text-label text-[var(--color-text-muted)]">
            {nightKind === 'first' ? 'First night' : 'Other night'}
          </p>
          <button
            type="button"
            className="min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={() => setPlaySurface('grimoire')}
          >
            Grimoire
          </button>
        </header>
        <h1 className="text-heading">Nothing to coach yet</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Record at least one role in setup, then start the first night again.
        </p>
      </section>
    )
  }

  if (playSurface === 'bridge') {
    return (
      <section className="flex min-h-dvh min-w-0 flex-col gap-4 overflow-x-hidden pt-8 pb-8">
        <header className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="text-label text-[var(--color-text-muted)]">Night complete</p>
          <button
            type="button"
            className="min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={() => setPlaySurface('grimoire')}
          >
            Grimoire
          </button>
        </header>
        <h1 className="text-heading">Night complete</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Bridge controls arrive next — use Grimoire if you need the table truth.
        </p>
      </section>
    )
  }

  if (playSurface === 'grimoire') {
    return (
      <section className="flex min-h-dvh min-w-0 flex-col gap-4 overflow-x-hidden pt-8 pb-8">
        <header className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h1 className="text-heading">Grimoire</h1>
          <button
            type="button"
            className="min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={() => setPlaySurface('coach')}
          >
            Back to coach
          </button>
        </header>
        <p className="text-body text-[var(--color-text-muted)]">
          Live grimoire panel arrives in a later step. Keep coaching from the
          beat screen.
        </p>
      </section>
    )
  }

  const total = beats.length
  const clampedIndex = Math.min(Math.max(beatIndex, 0), total - 1)
  const current = beats[clampedIndex]
  const playerName =
    current.kind === 'wake'
      ? players.find((player) => player.id === current.playerId)?.name
      : undefined

  return (
    <CoachBeatView
      beat={current}
      nightKind={nightKind}
      stepIndex={clampedIndex}
      totalSteps={total}
      playerName={playerName}
      catalog={catalog}
      persistWriteStatus={persistWriteStatus}
      onNext={() => advanceBeat(total)}
      onBack={() => retreatBeat()}
      onOpenGrimoire={() => setPlaySurface('grimoire')}
      onRetryPersist={() => {
        void retryCriticalPersist()
      }}
    />
  )
}
