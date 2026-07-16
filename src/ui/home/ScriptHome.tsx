import { Link } from 'react-router-dom'
import {
  loadCatalog,
  type LoadedCatalog,
  type Role,
  type TeamCounts,
} from '../../domain/script'

type CatalogView =
  | { status: 'ok'; catalog: LoadedCatalog }
  | { status: 'empty' }
  | { status: 'error' }

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

function readCatalog(): CatalogView {
  try {
    const catalog = loadCatalog()
    // Zero-script / empty payload → Empty state (fail-soft); Zod length gates usual path.
    if (catalog.roles.length === 0) {
      return { status: 'empty' }
    }
    return { status: 'ok', catalog }
  } catch {
    return { status: 'error' }
  }
}

function rolesByTeam(roles: Role[]): Record<(typeof TEAM_ORDER)[number], Role[]> {
  const grouped = {
    townsfolk: [] as Role[],
    outsider: [] as Role[],
    minion: [] as Role[],
    demon: [] as Role[],
  }
  for (const role of roles) {
    grouped[role.team].push(role)
  }
  return grouped
}

function TeamCountRow({ teamCounts }: { teamCounts: TeamCounts }) {
  return (
    <ul
      className="mt-3 flex flex-wrap gap-2"
      data-testid="tb-team-counts"
      aria-label="Role counts by team"
      data-team-count-townsfolk={teamCounts.townsfolk}
      data-team-count-outsider={teamCounts.outsider}
      data-team-count-minion={teamCounts.minion}
      data-team-count-demon={teamCounts.demon}
    >
      {TEAM_ORDER.map((team) => (
        <li key={team}>
          <span
            className={`text-label inline-flex rounded-sm px-2 py-0.5 ${TEAM_BADGE_CLASS[team]}`}
            data-testid={`tb-team-count-${team}`}
            data-team={team}
            data-team-count={teamCounts[team]}
          >
            {TEAM_LABEL[team]} {teamCounts[team]}
          </span>
        </li>
      ))}
    </ul>
  )
}

function RoleRoster({ roles }: { roles: Role[] }) {
  const grouped = rolesByTeam(roles)

  return (
    <div
      className="mt-4 max-h-64 overflow-y-auto overflow-x-hidden"
      data-testid="tb-role-roster"
      aria-label="Trouble Brewing role roster"
    >
      {TEAM_ORDER.map((team) => (
        <div key={team} className="mb-3 last:mb-0">
          <h3 className="text-label text-[var(--color-text-muted)]">
            {TEAM_LABEL[team]}
          </h3>
          <ul className="mt-1 flex flex-col gap-1">
            {grouped[team].map((role) => (
              <li
                key={role.id}
                className="flex flex-wrap items-center gap-2 text-body"
                data-testid="tb-role-row"
                data-role-id={role.id}
                data-role-name={role.name}
                data-team={role.team}
                data-first-night={role.firstNight}
                data-other-night={role.otherNight}
              >
                <span>{role.name}</span>
                <span
                  className={`text-label rounded-sm px-1.5 py-0.5 ${TEAM_BADGE_CLASS[team]}`}
                >
                  {TEAM_LABEL[team]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/**
 * Home composition: brand + TB catalog card (or Empty/Error).
 * Copy from 01-UI-SPEC Copywriting Contract — React text children only (T-01-01).
 * Offline ready chip is optimistic on valid catalog (D-01 D-02 D-03) — not SW-gated.
 * Catalog facts + data-* hooks expose TB correctness for Playwright (D-07 D-08).
 */
export function ScriptHome() {
  const view = readCatalog()

  return (
    <section className="flex flex-col gap-8 pt-16 pb-8">
      <header className="flex flex-col gap-4">
        <h1 className="text-display">Storyteller Copilot</h1>
        <p className="text-body text-[var(--color-text-muted)]">
          Helps you run Trouble Brewing — offline, on your phone.
        </p>
      </header>

      {view.status === 'empty' ? (
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
      ) : null}

      {view.status === 'error' ? (
        <div
          className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
          role="alert"
        >
          <p className="text-body">
            Couldn’t read script data. Reload the app. If it keeps failing,
            reinstall after a network connection.
          </p>
        </div>
      ) : null}

      {view.status === 'ok' ? (
        <div className="flex flex-col gap-6">
          <article
            className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
            aria-label="Trouble Brewing script"
            data-testid="tb-script-card"
            data-role-total={view.catalog.roles.length}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-heading">Trouble Brewing</h2>
              <span className="text-label text-[var(--color-text-muted)]">
                Available
              </span>
              <span
                className="text-label rounded-sm border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text-muted)]"
                data-testid="offline-ready"
              >
                Offline ready
              </span>
            </div>
            <p className="mt-2 text-label text-[var(--color-text-muted)]">
              22 roles · setup chart · night order
            </p>

            <TeamCountRow teamCounts={view.catalog.teamCounts} />

            <div
              className="mt-3 text-label text-[var(--color-text-muted)]"
              data-testid="tb-setup-chart"
              data-setup-chart-ready="true"
              data-player-counts={view.catalog.setupChart
                .map((row) => row.playerCount)
                .join(',')}
              data-setup-row-count={view.catalog.setupChart.length}
            >
              Setup chart ready for {view.catalog.setupChart.length} player
              counts (5–15)
            </div>

            <div
              className="sr-only"
              data-testid="tb-procedural-beats"
              data-beat-ids={view.catalog.proceduralBeats
                .map((b) => b.id)
                .join(',')}
            >
              Night procedural beats loaded
            </div>

            <RoleRoster roles={view.catalog.roles} />
          </article>

          <Link
            to="/setup"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Start setup
          </Link>
        </div>
      ) : null}
    </section>
  )
}
