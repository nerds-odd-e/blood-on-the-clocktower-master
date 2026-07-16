---
phase: 03-night-coach-live-grimoire
plan: 03
subsystem: night-coach
tags: [night-coach, prompts, expand, composePrompt, CoachBeatView]

requires:
  - phase: 03-night-coach-live-grimoire
    provides: buildNightBeats engine, play persist fields, Start first night → PlayScreen
provides:
  - IP-safe coach-copy.json + Zod load on catalog
  - composePrompt short+detail composer (COACH-02/03 copy path)
  - CoachBeatView full-screen next-beat UX with inline expand and sticky Next
  - Store advanceBeat / retreatBeat / clampBeatIndex / setPlaySurface
affects:
  - 03-04 (Demon Info bluff picker + soft confirm)
  - 03-05 (live grimoire + night bridge UI)

tech-stack:
  added: []
  patterns:
    - Paraphrased coach-copy.json validated at load; composePrompt falls back to reminders/notes
    - Inline expand (no Vaul); sticky accent Next; Grimoire header text link not accent
    - App tsc excludes `src/**/*.test.ts` so Wave 0 RED scaffolds do not block production build

key-files:
  created:
    - src/data/scripts/trouble-brewing/coach-copy.json
    - src/domain/coach/composePrompt.ts
    - src/domain/coach/index.ts
    - src/ui/play/CoachBeatView.tsx
  modified:
    - src/domain/script/schemas.ts
    - src/domain/script/loadCatalog.ts
    - src/domain/script/index.ts
    - src/ui/play/PlayScreen.tsx
    - src/state/setupSessionStore.ts
    - src/index.css
    - tsconfig.app.json

key-decisions:
  - "Coach copy keyed by procedure id / wake:{roleId} with optional nightKind; missing entries fall back to catalog reminders"
  - "Ship index-based Back + end-of-queue → playSurface bridge with minimal stub until 03-05"
  - "Exclude unit tests from app tsconfig so eligibleBluffs RED scaffold cannot break npm run build"

patterns-established:
  - "composePrompt(beat, ctx) → { short, detail } with {Role}/{Name} substitution"
  - "CoachBeatView owns expand state; PlayScreen routes coach | grimoire | bridge surfaces"
  - "Persist write fail mid-play soft banner above beat; coach stays usable"

requirements-completed: [COACH-02, COACH-03]

coverage:
  - id: D1
    description: composePrompt returns short+detail for dusk and wake beats from IP-safe coach-copy
    requirement: COACH-02
    verification:
      - kind: unit
        ref: src/domain/coach/composePrompt.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: CoachBeatView shows title, short prompt, More/Less detail, sticky Next
    requirement: COACH-02
    verification:
      - kind: other
        ref: rg More detail + composePrompt in CoachBeatView.tsx; npm run build
        status: pass
    human_judgment: true
    rationale: Visual phone layout and expand motion need human UAT on /play
  - id: D3
    description: Inline expand toggles detail without Vaul; ST judges language on info wakes
    requirement: COACH-03
    verification:
      - kind: other
        ref: coach-copy.json ST judges + no vaul in CoachBeatView
        status: pass
    human_judgment: true
    rationale: Confirm detail readability and privacy tip copy at table width
  - id: D4
    description: Scarlet Woman other-night detail covers conditional Demon ability (A2)
    requirement: COACH-02
    verification:
      - kind: other
        ref: rg scarlet/demon in coach-copy.json
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-16
status: complete
---

# Phase 03 Plan 03: Next-Beat Coach Prompts Summary

**Full-screen next-beat coach with paraphrased short/detail prompts, inline expand, and sticky Next/Back.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-16T09:48:11Z
- **Completed:** 2026-07-16T09:51:21Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Shipped `coach-copy.json` + Zod load for dusk/info/dawn and wake templates (Spy privacy, Imp kill, Scarlet Woman conditional tip)
- Greened `composePrompt` with catalog reminder fallbacks and ST-judges language for info wakes
- Built `CoachBeatView` + PlayScreen wiring: night meta, Grimoire link, expand, sticky Next, Back, bridge/grimoire stubs

## Task Commits

Each task was committed atomically:

1. **Task 1: coach-copy data + composePrompt green** - `b845ffb` (feat)
2. **Task 2: CoachBeatView full-screen next-beat UX** - `2ea989c` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/data/scripts/trouble-brewing/coach-copy.json` — IP-safe short/detail templates
- `src/domain/coach/composePrompt.ts` — prompt composer
- `src/domain/coach/index.ts` — barrel export
- `src/domain/script/schemas.ts` — CoachCopy Zod schemas on catalog
- `src/domain/script/loadCatalog.ts` — parse coach-copy at load
- `src/ui/play/CoachBeatView.tsx` — beat card + expand + sticky footer
- `src/ui/play/PlayScreen.tsx` — surface routing to CoachBeatView
- `src/state/setupSessionStore.ts` — advance/retreat/clamp/setPlaySurface
- `src/index.css` — coach beat enter motion (≤200ms)
- `tsconfig.app.json` — exclude unit tests from app tsc

## Decisions Made

- Lookup coach copy by `dusk` / `wake:{roleId}` with optional `nightKind`; fall back to procedural notes or role reminders without throwing
- Bridge and grimoire surfaces get minimal placeholders so Next/Grimoire navigation works before 03-05 UI
- Exclude `src/**/*.test.ts` from app TypeScript project so Wave 0 RED `eligibleBluffs` import cannot fail `npm run build`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Exclude unit tests from app tsc**
- **Found during:** Task 2 (CoachBeatView)
- **Issue:** `tsc -b` failed on Wave 0 RED `bluffs.test.ts` missing `./eligibleBluffs` (owned by 03-04)
- **Fix:** Added `"exclude": ["src/**/*.test.ts"]` to `tsconfig.app.json`
- **Files modified:** `tsconfig.app.json`
- **Verification:** `npm run build` exits 0
- **Committed in:** `2ea989c`

**Total deviations:** 1 auto-fixed (Rule 3)
**Impact on plan:** Unblocks production build; does not implement bluffs (03-04).

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| Night complete bridge body | `PlayScreen.tsx` | Full bridge CTA lands in 03-05 |
| Grimoire panel body | `PlayScreen.tsx` | Live grimoire lands in 03-05 |
| Demon Info bluff picker | deferred | Plan 03-04 owns chips + soft confirm |

## Issues Encountered

None beyond the build-blocking RED scaffold (handled above). Full `npm run test:unit` still fails on `bluffs.test.ts` until 03-04.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for 03-04 bluff picker on Demon Info and soft-confirm on Next
- Ready for 03-05 to replace bridge/grimoire placeholders
- E2E `play-coach.spec.ts` still RED until Demon bluffs land

## Self-Check: PASSED

- FOUND: `src/data/scripts/trouble-brewing/coach-copy.json`
- FOUND: `src/domain/coach/composePrompt.ts`
- FOUND: `src/ui/play/CoachBeatView.tsx`
- FOUND: commit `b845ffb`
- FOUND: commit `2ea989c`

---
*Phase: 03-night-coach-live-grimoire*
*Completed: 2026-07-16*
