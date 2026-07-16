import { useState } from 'react'
import type {
  Experience,
  PlayerAge,
  SetupPlayer,
} from '../../../state/setupSessionStore'

type PlayerRowProps = {
  player: SetupPlayer
  index: number
  isFirst: boolean
  isLast: boolean
  onChange: (changes: Partial<Omit<SetupPlayer, 'id'>>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

const experienceOptions: { value: Experience; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'some', label: 'Some' },
  { value: 'veteran', label: 'Veteran' },
]

const ageOptions: { value: PlayerAge; label: string }[] = [
  { value: 'kid', label: 'Kid' },
  { value: 'teen', label: 'Teen' },
  { value: 'adult', label: 'Adult' },
]

function OptionButtons<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value?: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="text-label text-[var(--color-text-muted)]">
        {label}
      </legend>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={`min-h-11 rounded-sm border px-2 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${
                selected
                  ? 'border-[var(--color-text-muted)] bg-[var(--color-text-primary)] text-[var(--color-dominant)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-primary)]'
              }`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function PlayerRow({
  player,
  index,
  isFirst,
  isLast,
  onChange,
  onMove,
  onRemove,
}: PlayerRowProps) {
  const [expanded, setExpanded] = useState(false)
  const playerLabel = player.name.trim() || `player ${index + 1}`

  return (
    <li
      className="min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
      data-testid="setup-player-row"
    >
      <label className="text-label text-[var(--color-text-muted)]">
        Player {index + 1} name
        <input
          type="text"
          value={player.name}
          placeholder="Player name"
          className="mt-2 min-h-11 w-full min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-dominant)] px-3 text-body text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          className="min-h-11 rounded-sm border border-[var(--color-border)] px-3 text-body disabled:opacity-40"
          disabled={isFirst}
          aria-label={`Move ${playerLabel} up`}
          onClick={() => onMove(-1)}
        >
          Up
        </button>
        <button
          type="button"
          className="min-h-11 rounded-sm border border-[var(--color-border)] px-3 text-body disabled:opacity-40"
          disabled={isLast}
          aria-label={`Move ${playerLabel} down`}
          onClick={() => onMove(1)}
        >
          Down
        </button>
        <button
          type="button"
          className="min-h-11 rounded-sm border border-[var(--color-border)] px-3 text-body"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Less' : 'More'}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-sm border border-[var(--color-border)] px-3 text-body text-[var(--color-text-primary)]"
          aria-label={`Remove ${playerLabel}`}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4">
          <OptionButtons
            label="Experience"
            options={experienceOptions}
            value={player.experience}
            onChange={(experience) => onChange({ experience })}
          />
          <OptionButtons
            label="Age"
            options={ageOptions}
            value={player.age}
            onChange={(age) => onChange({ age })}
          />
          <label className="text-label text-[var(--color-text-muted)]">
            Notes
            <textarea
              value={player.notes ?? ''}
              maxLength={200}
              rows={3}
              placeholder="Optional notes"
              className="mt-2 w-full resize-y rounded-sm border border-[var(--color-border)] bg-[var(--color-dominant)] px-3 py-2 text-body text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
              onChange={(event) => onChange({ notes: event.target.value })}
            />
          </label>
        </div>
      ) : null}
    </li>
  )
}
