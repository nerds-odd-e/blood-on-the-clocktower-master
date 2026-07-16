# Phase 2: Setup Wizard & Grimoire Capture - Pattern Map

**Mapped:** 2026-07-16
**Files analyzed:** 24
**Analogs found:** 18 / 24

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/domain/bag/types.ts` | model | transform | `src/domain/script/schemas.ts` | role-match |
| `src/domain/bag/buildBag.ts` | service | transform | `src/domain/script/loadCatalog.ts` | exact |
| `src/domain/bag/validateBag.ts` | utility | transform | `src/domain/script/schemas.ts` (`.refine`) | role-match |
| `src/domain/bag/heuristics.ts` | utility | transform | `src/domain/script/loadCatalog.ts` | partial |
| `src/domain/bag/buildBag.test.ts` | test | batch | *(none — Vitest not installed)* | none |
| `src/domain/bag/index.ts` | utility | transform | `src/domain/script/index.ts` | exact |
| `src/domain/grimoire/types.ts` | model | transform | `src/domain/script/schemas.ts` | role-match |
| `src/domain/grimoire/validateAssignments.ts` | utility | transform | `src/domain/script/loadCatalog.ts` + schemas refine | role-match |
| `src/domain/grimoire/validateAssignments.test.ts` | test | batch | *(none — Vitest not installed)* | none |
| `src/state/idbStorage.ts` | utility | file-I/O | *(none — first IndexedDB adapter)* | none |
| `src/state/setupSessionStore.ts` | store | event-driven | *(none — first Zustand store)* | none |
| `src/ui/setup/SetupWizard.tsx` | component | request-response | `src/ui/setup/SetupStub.tsx` + `src/app/App.tsx` | role-match |
| `src/ui/setup/steps/ScriptStep.tsx` | component | request-response | `src/ui/home/ScriptHome.tsx` | exact |
| `src/ui/setup/steps/PlayersStep.tsx` | component | CRUD | `src/ui/home/ScriptHome.tsx` (list + CTA) | role-match |
| `src/ui/setup/steps/DifficultyStep.tsx` | component | request-response | `src/ui/home/ScriptHome.tsx` (segment/badge chips) | role-match |
| `src/ui/setup/steps/BagStep.tsx` | component | request-response | `src/ui/home/ScriptHome.tsx` (`RoleRoster` / team groups) | exact |
| `src/ui/setup/steps/DealStep.tsx` | component | request-response | `src/ui/setup/SetupStub.tsx` | role-match |
| `src/ui/setup/steps/RecordStep.tsx` | component | CRUD | `src/ui/home/ScriptHome.tsx` (rows + `data-*`) | role-match |
| `src/ui/setup/steps/NightReadyStep.tsx` | component | request-response | `src/ui/setup/SetupStub.tsx` + ScriptHome empty/error cards | role-match |
| `src/ui/setup/components/PlayerRow.tsx` | component | CRUD | `ScriptHome` role row markup | role-match |
| `src/ui/setup/components/RolePicker.tsx` | component | CRUD | `ScriptHome` `RoleRoster` + team badges | role-match |
| `src/ui/setup/components/ConfirmDialog.tsx` | component | request-response | `ScriptHome` empty/error alert cards | partial |
| `src/app/routes.tsx` | route | request-response | `src/app/routes.tsx` (self) | exact |
| `e2e/setup-wizard.spec.ts` | test | request-response | `e2e/home.spec.ts` + `e2e/catalog.spec.ts` | exact |
| `e2e/setup-record.spec.ts` | test | request-response | `e2e/catalog.spec.ts` | role-match |
| `e2e/stubs.spec.ts` | test | request-response | `e2e/stubs.spec.ts` (modify) | exact |
| `e2e/home.spec.ts` | test | request-response | self (update `/setup` assertions) | exact |
| `package.json` / `vite.config.ts` / `vitest.config.ts` | config | batch | `package.json` + `vite.config.ts` + `playwright.config.ts` | partial |

Also remove or stop exporting `src/ui/setup/SetupStub.tsx` once `SetupWizard` is wired.

## Pattern Assignments

### `src/domain/bag/types.ts` + `src/domain/grimoire/types.ts` (model, transform)

**Analog:** `src/domain/script/schemas.ts`

**Imports / Zod schema pattern** (lines 1–15):
```typescript
import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  edition: z.literal('tb'),
  team: z.enum(['townsfolk', 'outsider', 'minion', 'demon']),
  // ...
})
```

**Exported types via `z.infer`** (lines 76–79):
```typescript
export type Role = z.infer<typeof RoleSchema>
export type SetupChartRow = z.infer<typeof SetupChartRowSchema>
export type ProceduralBeat = z.infer<typeof ProceduralBeatSchema>
export type TroubleBrewingCatalog = z.infer<typeof CatalogSchema>
```

**Copy for Phase 2:** Prefer Zod schemas for persisted session fields (`Difficulty`, player profile enums, `BagPlan` shape on rehydrate). Domain-only `BagPlan` / `AssignmentIssue` may be plain TS types if not persisted raw — but session blob must parse with Zod (RESEARCH security V5).

---

### `src/domain/bag/buildBag.ts` (service, transform)

**Analog:** `src/domain/script/loadCatalog.ts`

**Imports pattern** (lines 15–25):
```typescript
import rolesJson from '../../data/scripts/trouble-brewing/roles.json'
import setupChartJson from '../../data/scripts/trouble-brewing/setup-chart.json'
import {
  CatalogSchema,
  // ...
  type Role,
  type TroubleBrewingCatalog,
} from './schemas'
```

**Pure function + typed return** (lines 27–66):
```typescript
export type LoadedCatalog = TroubleBrewingCatalog & {
  teamCounts: TeamCounts
}

export function summarizeTeamCounts(roles: Role[]): TeamCounts {
  const counts: TeamCounts = {
    townsfolk: 0,
    outsider: 0,
    minion: 0,
    demon: 0,
  }
  for (const role of roles) {
    counts[role.team] += 1
  }
  return counts
}

export function loadCatalog(): LoadedCatalog {
  const roles = CatalogSchema.shape.roles.parse(rolesJson)
  const setupChart = SetupChartSchema.parse(setupChartJson).rows
  // ...
  return {
    ...catalog,
    teamCounts: summarizeTeamCounts(catalog.roles),
  }
}
```

**Copy for Phase 2:**
- Keep `buildBag` pure: `(input) => BagPlan` — no React, no Zustand.
- Take `LoadedCatalog` (or `catalog.setupChart` + `catalog.roles`) from `loadCatalog()`.
- Look up chart row: `catalog.setupChart.find((r) => r.playerCount === playerCount)`.
- Inject `rng` for tests (RESEARCH open question); production default `crypto.getRandomValues` / `Math.random`.
- Never put `'drunk'` in `BagPlan.tokens` — cover TF + `drunk: { coverRoleId }`.

---

### `src/domain/bag/validateBag.ts` + `src/domain/grimoire/validateAssignments.ts` (utility, transform)

**Analog:** `src/domain/script/schemas.ts` refine gates + `loadCatalog` fail-soft usage in UI

**Invariant refine pattern** (lines 17–30):
```typescript
export const SetupChartRowSchema = z
  .object({
    playerCount: z.number().int().min(5).max(15),
    townsfolk: z.number().int().nonnegative(),
    outsiders: z.number().int().nonnegative(),
    minions: z.number().int().nonnegative(),
    demons: z.number().int().nonnegative(),
  })
  .refine(
    (row) =>
      row.townsfolk + row.outsiders + row.minions + row.demons ===
      row.playerCount,
    { message: 'team counts must sum to playerCount' },
  )
```

**Team composition gate** (lines 57–71):
```typescript
roles: z
  .array(RoleSchema)
  .length(22)
  .refine((roles) => {
    const counts = { townsfolk: 0, outsider: 0, minion: 0, demon: 0 }
    for (const role of roles) counts[role.team] += 1
    return (
      counts.townsfolk === 13 &&
      counts.outsider === 4 &&
      counts.minion === 4 &&
      counts.demon === 1
    )
  }, { message: 'TB roles must be 13/4/4/1 by team' }),
```

**Copy for Phase 2:**
- `validateBag(plan, playerCount, catalog)`: `tokens.length === N`, no `'drunk'` in tokens, team counts match post-Baron composition, Imp present, Drunk cover ∈ unused TF when `drunk != null`.
- `validateAssignments(...)`: return `AssignmentIssue[]` (empty = clean) — do **not** throw for soft gate; UI lists issues then confirm (D-15).
- Prefer structured issue codes matching UI-SPEC soft-gate copy (`unassigned`, `token_mismatch`, `duplicate_token`).

---

### `src/domain/bag/heuristics.ts` (utility, transform)

**Analog:** partial — `loadCatalog.ts` team summarization + RESEARCH difficulty table

**Team ordering / labels to reuse from UI** (`ScriptHome.tsx` lines 14–21):
```typescript
const TEAM_ORDER = ['townsfolk', 'outsider', 'minion', 'demon'] as const

const TEAM_LABEL: Record<(typeof TEAM_ORDER)[number], string> = {
  townsfolk: 'Townsfolk',
  outsider: 'Outsiders',
  minion: 'Minions',
  demon: 'Demon',
}
```

**Copy for Phase 2:** Heuristics weight role *ids* within chart slots only; never change demon count or invent illegal mixes. Emit `whyNote` strings from UI-SPEC copy table (Easy/Standard/Hard). Profiles are **not** inputs (D-07).

---

### `src/domain/bag/index.ts` (barrel)

**Analog:** `src/domain/script/index.ts` (lines 1–16):
```typescript
export {
  loadCatalog,
  summarizeTeamCounts,
  type LoadedCatalog,
  type TeamCounts,
} from './loadCatalog'
export {
  CatalogSchema,
  // ...
  type Role,
  type SetupChartRow,
} from './schemas'
```

**Copy for Phase 2:** Same barrel style for `buildBag`, `validateBag`, types — UI imports from `../../domain/bag` / `../../domain/grimoire`.

---

### `src/ui/setup/SetupWizard.tsx` (component, request-response)

**Analog:** `src/ui/setup/SetupStub.tsx` (replace) + `src/app/App.tsx` (PhoneShell already wraps routes)

**Stub layout to replace** (`SetupStub.tsx` lines 7–21):
```typescript
export function SetupStub() {
  return (
    <section className="flex flex-col gap-4 pt-8 pb-8">
      <h1 className="text-heading">Setup</h1>
      <p className="text-body text-[var(--color-text-muted)]">
        Setup wizard comes in the next phase.
      </p>
      <Link
        to="/"
        className="text-body text-[var(--color-text-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
      >
        Back to home
      </Link>
    </section>
  )
}
```

**Shell already provided** (`App.tsx` lines 8–15):
```typescript
export default function App() {
  return (
    <BrowserRouter>
      <PhoneShell>
        <AppRoutes />
      </PhoneShell>
    </BrowserRouter>
  )
}
```

**Copy for Phase 2:**
- Do **not** nest a second `PhoneShell`.
- Switch on `wizardStep` from Zustand; stay on `/setup` for all steps including `nightReady`.
- Typography: step titles `text-heading`; Night ready may use `text-display` (UI-SPEC).
- Primary CTA classes from home Start setup (accent fill, `min-h-11`):

```222:227:src/ui/home/ScriptHome.tsx
          <Link
            to="/setup"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[var(--color-accent)] px-6 text-body font-semibold text-[#0B0B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Start setup
          </Link>
```

- Back / secondary links: underline text pattern from `SetupStub` / `PlayStub` (not accent).

---

### `src/ui/setup/steps/ScriptStep.tsx` (component, request-response)

**Analog:** `src/ui/home/ScriptHome.tsx` script card block

**Confirm-card surface** (lines 172–192):
```typescript
<article
  className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
  aria-label="Trouble Brewing script"
  data-testid="tb-script-card"
>
  <div className="flex flex-wrap items-center gap-2">
    <h2 className="text-heading">Trouble Brewing</h2>
    <span className="text-label text-[var(--color-text-muted)]">
      Available
    </span>
  </div>
  <p className="mt-2 text-label text-[var(--color-text-muted)]">
    22 roles · setup chart · night order
  </p>
</article>
```

**Copy for Phase 2:** One confirm card + CTA **Continue setup**; copy from `02-UI-SPEC.md` (locked note). Optional: call `loadCatalog()` only to fail-soft if catalog broken — same `try/catch` → empty/error as `readCatalog()` (lines 33–44).

---

### `src/ui/setup/steps/BagStep.tsx` + `RolePicker.tsx` (component)

**Analog:** `ScriptHome.tsx` `RoleRoster` + team badges

**Team badge classes** (lines 23–31):
```typescript
const TEAM_BADGE_CLASS: Record<(typeof TEAM_ORDER)[number], string> = {
  townsfolk:
    'bg-[var(--color-team-townsfolk-bg)] text-[var(--color-team-townsfolk-fg)]',
  outsider:
    'bg-[var(--color-team-outsider-bg)] text-[var(--color-team-outsider-fg)]',
  minion:
    'bg-[var(--color-team-minion-bg)] text-[var(--color-team-minion-fg)]',
  demon: 'bg-[var(--color-team-demon-bg)] text-[var(--color-team-demon-fg)]',
}
```

**Grouped list + `data-*` for E2E** (lines 86–124):
```typescript
function RoleRoster({ roles }: { roles: Role[] }) {
  const grouped = rolesByTeam(roles)
  return (
    <div data-testid="tb-role-roster" aria-label="Trouble Brewing role roster">
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
              >
                <span>{role.name}</span>
                <span className={`text-label rounded-sm px-1.5 py-0.5 ${TEAM_BADGE_CLASS[team]}`}>
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
```

**Copy for Phase 2:**
- Bag step: group **physical tokens** by team (resolve id → `Role` via catalog); show Drunk cover as the TF name in tokens; setup notes separately.
- Role picker: same chip styling; filter to **remaining** multiset only (D-13).
- Expose `data-testid` hooks for Playwright (`setup-bag-list`, `setup-role-chip`, `setup-player-row`, etc.) — follow catalog.spec’s attribute assertions pattern.

---

### `src/ui/setup/steps/PlayersStep.tsx` + `PlayerRow.tsx` + `ConfirmDialog.tsx`

**Analog:** ScriptHome empty/error cards + accent/destructive tokens from `index.css`

**Empty / alert card pattern** (`ScriptHome.tsx` lines 145–168):
```typescript
{view.status === 'empty' ? (
  <div
    className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
    role="status"
  >
    <h2 className="text-heading">No scripts loaded</h2>
    <p className="mt-2 text-body text-[var(--color-text-muted)]">
      Trouble Brewing data did not load. …
    </p>
  </div>
) : null}

{view.status === 'error' ? (
  <div
    className="rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
    role="alert"
  >
    <p className="text-body">Couldn’t read script data. …</p>
  </div>
) : null}
```

**CSS tokens** (`index.css` lines 6–14):
```css
--color-dominant: #0b0b0b;
--color-secondary: #1a1714;
--color-accent: #c4a35a;
--color-destructive: #b33a3a;
--color-text-primary: #f2ede6;
--color-text-muted: #a39e96;
--color-border: #2a2622;
```

**Copy for Phase 2:**
- Confirm dialogs: secondary surface + border; **Remove player** uses `bg-[var(--color-destructive)]`; soft-gate **Start anyway** is outline/secondary — **not** destructive (UI-SPEC).
- Touch targets: `min-h-11` (44px) like Start setup CTA.
- No Vaul/shadcn — hand-rolled overlay/dialog matching secondary card chrome.
- Player ids: `crypto.randomUUID()` (RESEARCH).

---

### `src/ui/setup/steps/DealStep.tsx` + `NightReadyStep.tsx` + `DifficultyStep.tsx`

**Analog:** `SetupStub.tsx` / `PlayStub.tsx` coaching stub layout

**Simple step shell** (`PlayStub.tsx` lines 7–20):
```typescript
export function PlayStub() {
  return (
    <section className="flex flex-col gap-4 pt-8 pb-8">
      <h1 className="text-heading">Play</h1>
      <p className="text-body text-[var(--color-text-muted)]">
        Night coach comes after setup.
      </p>
      <Link to="/" className="text-body text-[var(--color-text-primary)] underline …">
        Back to home
      </Link>
    </section>
  )
}
```

**Copy for Phase 2:** Deal = heading + coaching body from UI-SPEC + Continue CTA. Night ready = `text-display` title + summary labels; **no** link to `/play`. Difficulty = three equal segments; selected = accent fill + `#0B0B0B` text (same as primary CTA text color).

---

### `src/app/routes.tsx` (route, modify)

**Analog:** self (`routes.tsx` lines 1–16)

```typescript
import { Route, Routes } from 'react-router-dom'
import { ScriptHome } from '../ui/home/ScriptHome'
import { SetupStub } from '../ui/setup/SetupStub'
import { PlayStub } from '../ui/play/PlayStub'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ScriptHome />} />
      <Route path="/setup" element={<SetupStub />} />
      <Route path="/play" element={<PlayStub />} />
    </Routes>
  )
}
```

**Copy for Phase 2:** Swap `SetupStub` → `SetupWizard`. Keep shallow routes only — **no** `/setup/:step`. Leave `/play` as `PlayStub`.

---

### E2E: `e2e/setup-wizard.spec.ts` + `e2e/setup-record.spec.ts` + stub updates

**Analog:** `e2e/home.spec.ts` + `e2e/catalog.spec.ts` + `e2e/stubs.spec.ts`

**Phone viewport + navigation** (`home.spec.ts` lines 3–24):
```typescript
test.describe('home smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('Start setup navigates to /setup', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Start setup' })
      .or(page.getByRole('button', { name: 'Start setup' }))
      .click()
    await expect(page).toHaveURL(/\/setup/)
    await expect(page.getByRole('heading', { name: 'Setup' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
  })
})
```

**Real preview, no mocks** (`playwright.config.ts` lines 24–29):
```typescript
webServer: {
  command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
  url: 'http://127.0.0.1:4173',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
},
```

**Catalog asserts via `data-*` only** (`catalog.spec.ts` lines 23–37):
```typescript
const card = page.getByTestId('tb-script-card')
await expect(card).toHaveAttribute('data-role-total', '22')
const counts = page.getByTestId('tb-team-counts')
await expect(counts).toHaveAttribute('data-team-count-townsfolk', '13')
```

**Stub that must change** (`stubs.spec.ts` lines 4–8):
```typescript
test('/setup shows Setup and Back to home', async ({ page }) => {
  await page.goto('/setup')
  await expect(page.getByRole('heading', { name: 'Setup' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
})
```

**Copy for Phase 2:**
- Wave 0: rewrite `/setup` stub test + `home.spec.ts` “Setup” / “Back to home” expectations to wizard script-step copy (**Trouble Brewing**, **Continue setup**, **Back to home**).
- Keep `/play` stub assertions.
- New E2E: real TB data only; assert bag/role via UI `data-*` / accessible names — do not import JSON in specs (catalog pattern).
- Horizontal overflow check on wizard steps (reuse PLAT-01 pattern from `home.spec.ts` lines 27–37).

---

### Config: Vitest + package scripts

**Analog:** `package.json` scripts + `vite.config.ts` plugin list + `playwright.config.ts` as “test config sibling”

**Current scripts** (`package.json` lines 6–13):
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "oxlint",
  "preview": "vite preview",
  "test": "playwright test",
  "test:e2e": "playwright test",
  "test:e2e:offline": "playwright test e2e/offline.spec.ts"
}
```

**Copy for Phase 2:** Add deps `zustand`, `idb-keyval`, `vitest`; add `test:unit` → `vitest run`; keep `test` as Playwright or document dual suite in RESEARCH Validation Architecture. Prefer `vitest.config.ts` with `environment: 'node'`, include `src/**/*.test.ts`. No existing unit-test file to clone — use RESEARCH bag/grimoire examples.

## Shared Patterns

### Phone-first visual language
**Source:** `src/index.css` + `src/ui/home/ScriptHome.tsx` + `02-UI-SPEC.md`  
**Apply to:** All `src/ui/setup/**` components  
- Classes: `text-display` / `text-heading` / `text-body` / `text-label`
- Surfaces: `bg-[var(--color-secondary)]` + `border-[var(--color-border)]` + `rounded-sm`
- Primary CTA: accent fill + `#0B0B0B` text + `min-h-11` + focus-visible outline
- Team chips: reuse `TEAM_BADGE_CLASS` / CSS team variables

### Catalog load + Zod validation
**Source:** `src/domain/script/loadCatalog.ts`, `schemas.ts`  
**Apply to:** `buildBag`, session rehydrate, ScriptStep fail-soft  
- Parse with Zod; UI catches and shows empty/error cards (ScriptHome `readCatalog`)
- Setup chart rows already enforce 5–15 and sum-to-N — bag builder must consume them, not re-encode the sheet

### Shallow routing (wizard state out of URL)
**Source:** `src/app/routes.tsx`, `src/app/App.tsx`  
**Apply to:** SetupWizard + store  
- Routes remain `/`, `/setup`, `/play`
- Step machine lives in Zustand `wizardStep`

### Playwright E2E against real preview
**Source:** `playwright.config.ts`, `e2e/catalog.spec.ts`  
**Apply to:** `setup-wizard` / `setup-record` specs  
- Phone viewport 390×844 for wizard flows
- Assert through UI + `data-testid` / `data-*`; no catalog JSON imports in E2E
- Update stub expectations in Wave 0

### Error / empty / confirm chrome
**Source:** `ScriptHome.tsx` status cards  
**Apply to:** Players validation, ConfirmDialog, soft night gate, hydrate failure  
- `role="status"` empty, `role="alert"` errors
- Secondary bordered panels; destructive only for remove confirm

### Pure domain separation
**Source:** `src/domain/script/*` (no React imports)  
**Apply to:** `src/domain/bag/*`, `src/domain/grimoire/*`  
- UI and store call domain; domain never imports UI/state

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/state/setupSessionStore.ts` | store | event-driven | No Zustand in repo yet — use RESEARCH “Zustand persist → idb-keyval” example |
| `src/state/idbStorage.ts` | utility | file-I/O | No IndexedDB adapter yet — copy RESEARCH `StateStorage` + `idb-keyval` get/set/del |
| `src/domain/bag/buildBag.test.ts` | test | batch | No Vitest suite — Wave 0 install; pattern from RESEARCH Validation Architecture |
| `src/domain/grimoire/validateAssignments.test.ts` | test | batch | Same as above |
| Soft-gate / remove dialog interactions | component | request-response | No modal in codebase — invent from ScriptHome card chrome + UI-SPEC destructive/soft-gate rules |
| Persist hydration gate (`hasHydrated`) | store | event-driven | New concern — RESEARCH Pitfall 4 / Zustand `onFinishHydration` |

**Planner fallback:** Prefer RESEARCH.md Code Examples for Zustand + bag pipeline; prefer `02-UI-SPEC.md` for dialog copy and CTA labels.

## Metadata

**Analog search scope:** `src/**/*`, `e2e/**/*`, `package.json`, `vite.config.ts`, `playwright.config.ts`, `src/index.css`, phase `02-UI-SPEC.md`  
**Files scanned:** ~34 source/config + 4 e2e specs  
**Strong analogs used:** `loadCatalog.ts`, `schemas.ts`, `ScriptHome.tsx`, `SetupStub.tsx`, `routes.tsx`, `home.spec.ts`, `catalog.spec.ts`, `stubs.spec.ts`  
**Pattern extraction date:** 2026-07-16
