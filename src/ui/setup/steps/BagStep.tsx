import { loadCatalog, type Role } from '../../../domain/script'
import { useSetupSessionStore } from '../../../state/setupSessionStore'

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

export function BagStep() {
  const bag = useSetupSessionStore((state) => state.bag)
  const clearBag = useSetupSessionStore((state) => state.clearBag)
  const setWizardStep = useSetupSessionStore((state) => state.setWizardStep)
  const catalog = loadCatalog()
  const rolesById = new Map(catalog.roles.map((role) => [role.id, role]))
  const grouped: Record<(typeof TEAM_ORDER)[number], Role[]> = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
  }

  if (!bag) return null
  for (const token of bag.tokens) {
    const role = rolesById.get(token)
    if (role) grouped[role.team].push(role)
  }

  return (
    <section className="flex min-h-dvh flex-col gap-6 pt-8 pb-28">
      <header className="flex flex-col gap-2">
        <p className="text-label text-[var(--color-text-muted)]">Step 4 of 6</p>
        <h1 className="text-heading">Your bag</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Keep this screen private — players should not see it.
        </p>
      </header>

      <div className="flex flex-col gap-5" data-testid="setup-bag-list">
        {TEAM_ORDER.map((team) =>
          grouped[team].length > 0 ? (
            <section key={team} aria-labelledby={`bag-team-${team}`}>
              <h2
                id={`bag-team-${team}`}
                className="text-label text-[var(--color-text-muted)]"
              >
                {TEAM_LABEL[team]}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {grouped[team].map((role) => (
                  <li
                    key={role.id}
                    className={`rounded-sm px-2 py-1 text-label ${TEAM_BADGE_CLASS[team]}`}
                    data-role-id={role.id}
                  >
                    {role.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null,
        )}
      </div>

      {bag.setupNotes.length > 0 ? (
        <div className="text-body text-[var(--color-text-muted)]">
          <p className="font-semibold text-[var(--color-text-primary)]">
            Setup notes:
          </p>
          <ul className="mt-1 list-disc pl-5">
            {bag.setupNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-body text-[var(--color-text-muted)]">{bag.whyNote}</p>

      <footer className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-[var(--color-dominant)] py-4">
        <button
          type="button"
          className="min-h-11 self-start text-body underline underline-offset-4"
          onClick={() => {
            clearBag()
            setWizardStep('difficulty')
          }}
        >
          Back
        </button>
        <button
          type="button"
          className="min-h-12 rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B]"
          onClick={() => setWizardStep('deal')}
        >
          Accept bag
        </button>
      </footer>
    </section>
  )
}
