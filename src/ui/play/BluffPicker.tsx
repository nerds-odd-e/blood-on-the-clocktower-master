import { eligibleBluffRoleIds, type Assignment } from '../../domain/grimoire'
import type { LoadedCatalog, Role } from '../../domain/script'

const TEAM_BADGE_CLASS: Record<'townsfolk' | 'outsider', string> = {
  townsfolk:
    'bg-[var(--color-team-townsfolk-bg)] text-[var(--color-team-townsfolk-fg)]',
  outsider:
    'bg-[var(--color-team-outsider-bg)] text-[var(--color-team-outsider-fg)]',
}

type BluffPickerProps = {
  assignments: Record<string, Assignment>
  catalog: LoadedCatalog
  selected: string[]
  onToggle: (roleId: string) => void
}

/**
 * Demon Info bluff chip picker — good not-in-play roles, max three (D-10–D-11).
 */
export function BluffPicker({
  assignments,
  catalog,
  selected,
  onToggle,
}: BluffPickerProps) {
  const eligibleIds = eligibleBluffRoleIds(assignments, catalog)
  const roleById = new Map(catalog.roles.map((role) => [role.id, role]))
  const options = eligibleIds
    .map((roleId) => roleById.get(roleId))
    .filter((role): role is Role => role !== undefined)

  return (
    <section className="mt-6 min-w-0" aria-label="Demon bluffs">
      <h2 className="text-label text-[var(--color-text-primary)]">
        Demon bluffs
      </h2>
      <p className="mt-1 text-body text-[var(--color-text-muted)]">
        Pick three Townsfolk or Outsiders that are not in play.
      </p>

      {options.length === 0 ? (
        <p className="mt-3 text-body text-[var(--color-text-muted)]">
          No eligible bluff characters left — check recorded roles.
        </p>
      ) : (
        <div className="mt-3 flex min-w-0 flex-wrap gap-1">
          {options.map((role) => {
            const isSelected = selected.includes(role.id)
            const team = role.team as 'townsfolk' | 'outsider'
            return (
              <button
                key={role.id}
                type="button"
                data-testid="bluff-chip"
                data-role-id={role.id}
                aria-pressed={isSelected}
                className={`min-h-11 max-w-full break-words rounded-sm px-3 py-2 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                  isSelected
                    ? 'bg-[var(--color-accent)] text-[#0B0B0B]'
                    : TEAM_BADGE_CLASS[team]
                }`}
                onClick={() => onToggle(role.id)}
              >
                {role.name}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
