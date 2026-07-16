import type { Role } from '../../../domain/script'

const TEAM_ORDER = ['townsfolk', 'outsider', 'minion', 'demon'] as const

const TEAM_LABEL: Record<(typeof TEAM_ORDER)[number], string> = {
  townsfolk: 'Townsfolk',
  outsider: 'Outsiders',
  minion: 'Minions',
  demon: 'Demon',
}

const TEAM_BADGE_CLASS: Record<(typeof TEAM_ORDER)[number], string> = {
  townsfolk:
    'bg-[var(--color-team-townsfolk-bg)] text-[var(--color-team-townsfolk-fg)]',
  outsider:
    'bg-[var(--color-team-outsider-bg)] text-[var(--color-team-outsider-fg)]',
  minion:
    'bg-[var(--color-team-minion-bg)] text-[var(--color-team-minion-fg)]',
  demon: 'bg-[var(--color-team-demon-bg)] text-[var(--color-team-demon-fg)]',
}

type RolePickerProps = {
  remaining: string[]
  roles: Role[]
  canClear: boolean
  onAssign: (roleId: string) => void
  onClear: () => void
}

export function RolePicker({
  remaining,
  roles,
  canClear,
  onAssign,
  onClear,
}: RolePickerProps) {
  const roleById = new Map(roles.map((role) => [role.id, role]))
  const options = remaining
    .map((roleId, tokenIndex) => ({
      role: roleById.get(roleId),
      roleId,
      tokenIndex,
    }))
    .filter(
      (option): option is typeof option & { role: Role } =>
        option.role !== undefined,
    )

  return (
    <section
      className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
      aria-label="Pick character"
    >
      <h2 className="text-heading">Pick character</h2>

      {options.length === 0 ? (
        <p className="mt-3 text-body text-[var(--color-text-muted)]">
          All bag tokens are assigned. Tap a player to change or clear.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {TEAM_ORDER.map((team) => {
            const teamOptions = options.filter(
              (option) => option.role.team === team,
            )
            if (teamOptions.length === 0) return null
            return (
              <div key={team}>
                <h3 className="text-label text-[var(--color-text-muted)]">
                  {TEAM_LABEL[team]}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {teamOptions.map(({ role, roleId, tokenIndex }) => (
                    <button
                      key={`${roleId}-${tokenIndex}`}
                      type="button"
                      className={`min-h-11 rounded-sm px-3 py-2 text-label focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${TEAM_BADGE_CLASS[team]}`}
                      data-testid="setup-role-chip"
                      data-role-id={roleId}
                      onClick={() => onAssign(roleId)}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {canClear ? (
        <button
          type="button"
          className="mt-4 min-h-11 text-body underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          onClick={onClear}
        >
          Clear role
        </button>
      ) : null}
    </section>
  )
}
