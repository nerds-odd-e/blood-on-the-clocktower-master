import { useState } from 'react'
import {
  useSetupSessionStore,
  type SetupPlayer,
} from '../../../state/setupSessionStore'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PlayerRow } from '../components/PlayerRow'

export function PlayersStep() {
  const players = useSetupSessionStore((state) => state.players)
  const addPlayer = useSetupSessionStore((state) => state.addPlayer)
  const updatePlayer = useSetupSessionStore((state) => state.updatePlayer)
  const movePlayer = useSetupSessionStore((state) => state.movePlayer)
  const removePlayer = useSetupSessionStore((state) => state.removePlayer)
  const setWizardStep = useSetupSessionStore((state) => state.setWizardStep)
  const [removeTarget, setRemoveTarget] = useState<SetupPlayer | null>(null)
  const [duplicateError, setDuplicateError] = useState(false)
  const hasLegalCount = players.length >= 5 && players.length <= 15

  const next = () => {
    const names = players.map((player) => player.name.trim())
    const unique = new Set(names)
    if (names.some((name) => name.length === 0) || unique.size !== names.length) {
      setDuplicateError(true)
      return
    }
    setDuplicateError(false)
    setWizardStep('difficulty')
  }

  return (
    <section className="flex min-h-dvh flex-col gap-6 pt-8 pb-32">
      <header className="flex flex-col gap-2">
        <p className="text-label text-[var(--color-text-muted)]">Step 2 of 6</p>
        <h1 className="text-heading">Players</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Seat order is top to bottom. Need 5–15 players.
        </p>
      </header>

      {players.length === 0 ? (
        <div
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          role="status"
        >
          <h2 className="text-heading">No players yet</h2>
          <p className="mt-2 text-body text-[var(--color-text-muted)]">
            Tap Add player to seat the table.
          </p>
        </div>
      ) : (
        <ol className="flex min-w-0 flex-col gap-3">
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              index={index}
              isFirst={index === 0}
              isLast={index === players.length - 1}
              onChange={(changes) => updatePlayer(player.id, changes)}
              onMove={(direction) => movePlayer(player.id, direction)}
              onRemove={() => setRemoveTarget(player)}
            />
          ))}
        </ol>
      )}

      <button
        type="button"
        disabled={players.length >= 15}
        className="min-h-11 rounded-sm border border-[var(--color-border)] px-4 text-body disabled:opacity-40"
        onClick={addPlayer}
      >
        Add player
      </button>
      {players.length >= 15 ? (
        <p className="text-label text-[var(--color-text-muted)]">
          Maximum 15 players.
        </p>
      ) : null}

      {!hasLegalCount ? (
        <p className="text-body text-[var(--color-text-muted)]" role="status">
          Need 5–15 players to continue.
        </p>
      ) : null}
      {duplicateError ? (
        <p className="text-body" role="alert">
          Each player needs a unique name. Fix duplicates, then try Next step.
        </p>
      ) : null}

      <footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
        <button
          type="button"
          className="min-h-11 self-start text-body underline underline-offset-4"
          onClick={() => setWizardStep('script')}
        >
          Back
        </button>
        <button
          type="button"
          disabled={!hasLegalCount}
          className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={next}
        >
          Next step
        </button>
      </footer>

      {removeTarget ? (
        <ConfirmDialog
          title={`Remove ${removeTarget.name.trim() || 'this player'}?`}
          confirmLabel="Remove player"
          dismissLabel="Keep player"
          destructive
          onConfirm={() => {
            removePlayer(removeTarget.id)
            setRemoveTarget(null)
          }}
          onDismiss={() => setRemoveTarget(null)}
        />
      ) : null}
    </section>
  )
}
