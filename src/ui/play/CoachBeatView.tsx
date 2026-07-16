import { useEffect, useState } from 'react'
import type { Beat } from '../../domain/engine'
import { composePrompt } from '../../domain/coach'
import type { Assignment } from '../../domain/grimoire'
import type { LoadedCatalog } from '../../domain/script'
import type { NightKind } from '../../state/setupSessionStore'
import type { PersistWriteStatus } from '../../state/persistStatus'
import { ConfirmDialog } from '../setup/components/ConfirmDialog'
import { BluffPicker } from './BluffPicker'

type CoachBeatViewProps = {
  beat: Beat
  nightKind: NightKind
  stepIndex: number
  totalSteps: number
  playerName?: string
  catalog: LoadedCatalog
  assignments: Record<string, Assignment>
  demonBluffs: string[]
  persistWriteStatus: PersistWriteStatus
  onToggleDemonBluff: (roleId: string) => void
  onNext: () => void
  onBack: () => void
  onOpenGrimoire: () => void
  onRetryPersist: () => void
}

/**
 * Full-screen next-beat coach: short prompt, inline expand, sticky Next (D-01–D-04, D-08).
 * Demon Info embeds BluffPicker + soft confirm when leaving with fewer than 3 bluffs (D-10–D-12).
 */
export function CoachBeatView({
  beat,
  nightKind,
  stepIndex,
  totalSteps,
  playerName,
  catalog,
  assignments,
  demonBluffs,
  persistWriteStatus,
  onToggleDemonBluff,
  onNext,
  onBack,
  onOpenGrimoire,
  onRetryPersist,
}: CoachBeatViewProps) {
  const [expanded, setExpanded] = useState(false)
  const [bluffConfirmOpen, setBluffConfirmOpen] = useState(false)
  const prompt = composePrompt(beat, {
    nightKind,
    catalog,
    playerName,
  })

  useEffect(() => {
    setExpanded(false)
    setBluffConfirmOpen(false)
  }, [beat.id])

  const stepLabel = nightKind === 'first' ? 'First night' : 'Other night'
  const nightMeta = `${stepLabel} · step ${stepIndex + 1} of ${totalSteps}`
  const showBack = stepIndex > 0
  const isDemonInfo = beat.id === 'demon-info'

  const handleNext = () => {
    if (isDemonInfo && demonBluffs.length < 3) {
      setBluffConfirmOpen(true)
      return
    }
    onNext()
  }

  return (
    <section className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden pt-8">
      <header className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p
          className="text-label text-[var(--color-text-muted)]"
          aria-current="step"
        >
          {nightMeta}
        </p>
        <button
          type="button"
          className="min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          onClick={onOpenGrimoire}
        >
          Grimoire
        </button>
      </header>

      {persistWriteStatus === 'error' ? (
        <div
          className="mt-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          role="status"
        >
          <p className="text-body text-[var(--color-text-muted)]">
            Couldn’t save just now. Check storage, then try again — your last
            screen may still be in memory.
          </p>
          <button
            type="button"
            className="mt-3 min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={onRetryPersist}
          >
            Retry
          </button>
        </div>
      ) : null}

      <main className="mt-6 flex min-w-0 flex-1 flex-col pb-4">
        <div
          key={beat.id}
          className="coach-beat-enter min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
        >
          <h1 className="text-heading break-words">{beat.label}</h1>
          {beat.kind === 'wake' && playerName ? (
            <p className="mt-2 text-body break-words text-[var(--color-text-muted)]">
              {playerName}
            </p>
          ) : null}
          <p className="mt-8 text-body break-words">{prompt.short}</p>

          {isDemonInfo ? (
            <BluffPicker
              assignments={assignments}
              catalog={catalog}
              selected={demonBluffs}
              onToggle={onToggleDemonBluff}
            />
          ) : null}

          <button
            type="button"
            className="mt-4 min-h-11 text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Less detail' : 'More detail'}
          </button>

          {expanded ? (
            <p className="mt-4 text-body break-words whitespace-pre-wrap border-t border-[var(--color-border)] pt-4">
              {prompt.detail}
            </p>
          ) : null}
        </div>
      </main>

      <footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
        {showBack ? (
          <button
            type="button"
            className="min-h-11 self-start text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={onBack}
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          className="min-h-12 w-full rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          onClick={handleNext}
        >
          Next
        </button>
      </footer>

      {bluffConfirmOpen ? (
        <ConfirmDialog
          title="Bluffs incomplete"
          confirmLabel="Continue anyway"
          dismissLabel="Keep editing"
          onConfirm={() => {
            setBluffConfirmOpen(false)
            onNext()
          }}
          onDismiss={() => setBluffConfirmOpen(false)}
        >
          <p>
            You have {demonBluffs.length} of 3 bluffs. You can continue, but the
            Demon info step is easier with all three.
          </p>
        </ConfirmDialog>
      ) : null}
    </section>
  )
}
