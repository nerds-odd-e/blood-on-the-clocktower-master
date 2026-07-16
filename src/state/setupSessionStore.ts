import { z } from 'zod'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { buildBag, type BagPlan } from '../domain/bag'
import { eligibleBluffRoleIds, type Assignment } from '../domain/grimoire'
import { loadCatalog, type LoadedCatalog } from '../domain/script'
import { idbStorage } from './idbStorage'
import type { PersistWriteStatus } from './persistStatus'
import { assertSetupSessionSemantics } from './setupSessionSemantics'

export const SETUP_SESSION_STORAGE_KEY = 'st-copilot-setup-session'

export const WizardStepSchema = z.enum([
  'script',
  'players',
  'difficulty',
  'bag',
  'deal',
  'record',
  'nightReady',
])
export const DifficultySchema = z.enum(['easy', 'standard', 'hard'])
export const ExperienceSchema = z.enum(['new', 'some', 'veteran'])
export const AgeSchema = z.enum(['kid', 'teen', 'adult'])

const BagPlanSchema = z.object({
  tokens: z.array(z.string().min(1)).min(5).max(15),
  composition: z.object({
    townsfolk: z.number().int().nonnegative(),
    outsiders: z.number().int().nonnegative(),
    minions: z.number().int().nonnegative(),
    demons: z.number().int().nonnegative(),
  }),
  drunk: z.object({ coverRoleId: z.string().min(1) }).nullable(),
  setupNotes: z.array(z.string()),
  whyNote: z.string().min(1),
})

const AssignmentSchema = z.object({
  playerId: z.string().min(1),
  bagRoleId: z.string().min(1),
  trueRoleId: z.string().min(1).optional(),
  believedRoleId: z.string().min(1).optional(),
})

export const SetupPlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  experience: ExperienceSchema.optional(),
  age: AgeSchema.optional(),
  notes: z.string().max(200).optional(),
})

export const NightKindSchema = z.enum(['first', 'other'])
export const PlaySurfaceSchema = z.enum(['coach', 'grimoire', 'bridge'])

const PersistedSetupSessionSchema = z.object({
  wizardStep: WizardStepSchema,
  players: z.array(SetupPlayerSchema).max(15),
  difficulty: DifficultySchema,
  bag: BagPlanSchema.nullable(),
  assignments: z.record(z.string(), AssignmentSchema),
  nightKind: NightKindSchema,
  beatIndex: z.number().int().nonnegative(),
  playSurface: PlaySurfaceSchema,
  deadPlayerIds: z.array(z.string().min(1)),
  reminders: z.record(z.string(), z.array(z.string())),
  demonBluffs: z.array(z.string().min(1)),
  diedTonightIds: z.array(z.string().min(1)),
  playStarted: z.boolean(),
})

export type WizardStep = z.infer<typeof WizardStepSchema>
export type Difficulty = z.infer<typeof DifficultySchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type PlayerAge = z.infer<typeof AgeSchema>
export type SetupPlayer = z.infer<typeof SetupPlayerSchema>
export type NightKind = z.infer<typeof NightKindSchema>
export type PlaySurface = z.infer<typeof PlaySurfaceSchema>

type PersistedSetupSession = z.infer<typeof PersistedSetupSessionSchema>

const PLAY_FIELD_DEFAULTS = {
  nightKind: 'first' as const,
  beatIndex: 0,
  playSurface: 'coach' as const,
  deadPlayerIds: [] as string[],
  reminders: {} as Record<string, string[]>,
  demonBluffs: [] as string[],
  diedTonightIds: [] as string[],
  playStarted: false,
}

/**
 * Drop orphan death/reminder/bluff entries so persist semantics stay valid
 * after player/assignment mutations (CR-01 / WR-03).
 */
function scrubPlayFieldsForPlayers(
  state: PersistedSetupSession,
  catalog: LoadedCatalog,
): Pick<
  PersistedSetupSession,
  'deadPlayerIds' | 'diedTonightIds' | 'reminders' | 'demonBluffs'
> {
  const playerIds = new Set(state.players.map((p) => p.id))
  const deadPlayerIds = state.deadPlayerIds.filter((id) => playerIds.has(id))
  const diedTonightIds = state.diedTonightIds.filter((id) => playerIds.has(id))
  const reminders: Record<string, string[]> = {}
  for (const [playerId, tokens] of Object.entries(state.reminders)) {
    if (!playerIds.has(playerId)) continue
    const assignment = state.assignments[playerId]
    if (!assignment) continue
    const truthId = assignment.trueRoleId ?? assignment.bagRoleId
    const allowed = new Set(
      catalog.roles.find((r) => r.id === truthId)?.reminders ?? [],
    )
    reminders[playerId] = tokens.filter((t) => allowed.has(t))
  }
  const eligible = new Set(eligibleBluffRoleIds(state.assignments, catalog))
  const demonBluffs = state.demonBluffs.filter((id) => eligible.has(id)).slice(0, 3)
  return { deadPlayerIds, diedTonightIds, reminders, demonBluffs }
}

type SetupSessionState = PersistedSetupSession & {
  hasHydrated: boolean
  hydrationError: boolean
  persistWriteStatus: PersistWriteStatus
  /** Anchor beat id for remapping when the night queue membership changes. */
  currentBeatId: string | null
  /** Surface to restore when leaving grimoire (coach vs night-complete bridge). */
  grimoireReturnSurface: 'coach' | 'bridge'
  setWizardStep: (wizardStep: WizardStep) => void
  openGrimoire: () => void
  returnFromGrimoire: () => void
  setDifficulty: (difficulty: Difficulty) => void
  generateBag: () => void
  clearBag: () => void
  assignRole: (playerId: string, bagRoleId: string) => void
  clearRole: (playerId: string) => void
  addPlayer: () => void
  updatePlayer: (id: string, changes: Partial<Omit<SetupPlayer, 'id'>>) => void
  movePlayer: (id: string, direction: -1 | 1) => void
  removePlayer: (id: string) => void
  resetFresh: () => void
  clearHydrationError: () => void
  awaitCriticalPersist: () => Promise<void>
  retryCriticalPersist: () => Promise<void>
  advanceToNightReady: () => Promise<void>
  startFirstNight: () => void
  advanceBeat: (beatIds: string[]) => void
  retreatBeat: (beatIds: string[]) => void
  clampBeatIndex: (queueLength: number) => void
  syncBeatCursor: (beatIds: string[]) => void
  setPlaySurface: (playSurface: PlaySurface) => void
  setDemonBluffs: (roleIds: string[]) => void
  toggleDemonBluff: (roleId: string) => void
  toggleDead: (playerId: string) => void
  setPlayerReminders: (playerId: string, reminders: string[]) => void
  startOtherNight: () => void
}

function partializedSession(state: PersistedSetupSession) {
  return {
    wizardStep: state.wizardStep,
    players: state.players,
    difficulty: state.difficulty,
    bag: state.bag,
    assignments: state.assignments,
    nightKind: state.nightKind,
    beatIndex: state.beatIndex,
    playSurface: state.playSurface,
    deadPlayerIds: state.deadPlayerIds,
    reminders: state.reminders,
    demonBluffs: state.demonBluffs,
    diedTonightIds: state.diedTonightIds,
    playStarted: state.playStarted,
  }
}

const freshSession = (): PersistedSetupSession => ({
  wizardStep: 'script',
  players: [],
  difficulty: 'standard',
  bag: null,
  assignments: {},
  ...PLAY_FIELD_DEFAULTS,
})
export function remainingTokens(
  bag: BagPlan | null,
  assignments: Record<string, Assignment>,
  excludedPlayerId?: string,
) {
  if (!bag) return []

  const assignedCounts = new Map<string, number>()
  for (const assignment of Object.values(assignments)) {
    if (assignment.playerId === excludedPlayerId) continue
    assignedCounts.set(
      assignment.bagRoleId,
      (assignedCounts.get(assignment.bagRoleId) ?? 0) + 1,
    )
  }

  return bag.tokens.filter((roleId) => {
    const assigned = assignedCounts.get(roleId) ?? 0
    if (assigned === 0) return true
    assignedCounts.set(roleId, assigned - 1)
    return false
  })
}

export const useSetupSessionStore = create<SetupSessionState>()(
  persist(
    (set, get) => ({
      ...freshSession(),
      currentBeatId: null,
      grimoireReturnSurface: 'coach' as const,
      hasHydrated: false,
      hydrationError: false,
      persistWriteStatus: 'saved' as PersistWriteStatus,
      setWizardStep: (wizardStep) => set({ wizardStep }),
      setDifficulty: (difficulty) =>
        set({
          difficulty,
          bag: null,
          assignments: {},
          ...PLAY_FIELD_DEFAULTS,
        }),
      generateBag: () =>
        set((state) => {
          const bag: BagPlan = buildBag({
            playerCount: state.players.length,
            difficulty: state.difficulty,
            catalog: loadCatalog(),
          })
          return {
            bag,
            assignments: {},
            wizardStep: 'bag' as const,
            ...PLAY_FIELD_DEFAULTS,
          }
        }),
      clearBag: () =>
        set({ bag: null, assignments: {}, ...PLAY_FIELD_DEFAULTS }),
      assignRole: (playerId, bagRoleId) =>
        set((state) => {
          if (
            !state.players.some((player) => player.id === playerId) ||
            !remainingTokens(state.bag, state.assignments, playerId).includes(
              bagRoleId,
            )
          ) {
            return state
          }

          const isDrunkCover = state.bag?.drunk?.coverRoleId === bagRoleId
          const assignment: Assignment = {
            playerId,
            bagRoleId,
            ...(isDrunkCover
              ? { trueRoleId: 'drunk', believedRoleId: bagRoleId }
              : { trueRoleId: bagRoleId, believedRoleId: bagRoleId }),
          }
          const next: PersistedSetupSession = {
            ...partializedSession(state),
            assignments: { ...state.assignments, [playerId]: assignment },
          }
          return {
            assignments: next.assignments,
            ...scrubPlayFieldsForPlayers(next, loadCatalog()),
          }
        }),
      clearRole: (playerId) =>
        set((state) => {
          if (!state.assignments[playerId]) return state
          const assignments = { ...state.assignments }
          delete assignments[playerId]
          const next: PersistedSetupSession = {
            ...partializedSession(state),
            assignments,
          }
          return {
            assignments,
            ...scrubPlayFieldsForPlayers(next, loadCatalog()),
          }
        }),
      addPlayer: () =>
        set((state) => ({
          players:
            state.players.length >= 15
              ? state.players
              : [
                  ...state.players,
                  { id: crypto.randomUUID(), name: '' },
                ],
        })),
      updatePlayer: (id, changes) =>
        set((state) => ({
          players: state.players.map((player) =>
            player.id === id
              ? {
                  ...player,
                  ...changes,
                  ...(changes.notes === undefined
                    ? {}
                    : { notes: changes.notes.slice(0, 200) }),
                }
              : player,
          ),
        })),
      movePlayer: (id, direction) =>
        set((state) => {
          const from = state.players.findIndex((player) => player.id === id)
          const to = from + direction
          if (from < 0 || to < 0 || to >= state.players.length) {
            return state
          }
          const players = [...state.players]
          ;[players[from], players[to]] = [players[to], players[from]]
          return { players }
        }),
      removePlayer: (id) =>
        set((state) => {
          const assignments = { ...state.assignments }
          delete assignments[id]
          const players = state.players.filter((player) => player.id !== id)
          const next: PersistedSetupSession = {
            ...partializedSession(state),
            players,
            assignments,
          }
          return {
            players,
            assignments,
            ...scrubPlayFieldsForPlayers(next, loadCatalog()),
          }
        }),
      resetFresh: () =>
        set({
          ...freshSession(),
          currentBeatId: null,
          grimoireReturnSurface: 'coach',
          persistWriteStatus: 'saved',
        }),
      clearHydrationError: () => set({ hydrationError: false }),
      awaitCriticalPersist: async () => {
        set({ persistWriteStatus: 'saving' })
        const snapshot = partializedSession(get())
        const payload = JSON.stringify({ state: snapshot, version: 2 })
        try {
          await idbStorage.setItem(SETUP_SESSION_STORAGE_KEY, payload)
          set({ persistWriteStatus: 'saved' })
        } catch {
          set({ persistWriteStatus: 'error' })
        }
      },
      retryCriticalPersist: async () => {
        await get().awaitCriticalPersist()
      },
      advanceToNightReady: async () => {
        set({ wizardStep: 'nightReady', persistWriteStatus: 'saving' })
        await get().awaitCriticalPersist()
      },
      startFirstNight: () =>
        set({
          nightKind: 'first',
          beatIndex: 0,
          currentBeatId: null,
          playSurface: 'coach',
          playStarted: true,
        }),
      advanceBeat: (beatIds) =>
        set((state) => {
          const queueLength = beatIds.length
          if (queueLength <= 0) {
            return { playSurface: 'bridge' as const, currentBeatId: null }
          }
          if (state.beatIndex >= queueLength - 1) {
            return { playSurface: 'bridge' as const, currentBeatId: null }
          }
          const nextIndex = state.beatIndex + 1
          return {
            beatIndex: nextIndex,
            currentBeatId: beatIds[nextIndex] ?? null,
          }
        }),
      retreatBeat: (beatIds) =>
        set((state) => {
          const nextIndex = Math.max(0, state.beatIndex - 1)
          return {
            beatIndex: nextIndex,
            currentBeatId: beatIds[nextIndex] ?? null,
          }
        }),
      clampBeatIndex: (queueLength) =>
        set((state) => {
          if (queueLength <= 0) {
            return state.beatIndex === 0 && state.currentBeatId === null
              ? state
              : { beatIndex: 0, currentBeatId: null }
          }
          const maxIndex = queueLength - 1
          if (state.beatIndex > maxIndex) {
            return { beatIndex: maxIndex, currentBeatId: null }
          }
          return state
        }),
      syncBeatCursor: (beatIds) =>
        set((state) => {
          if (beatIds.length === 0) {
            return state.beatIndex === 0 && state.currentBeatId === null
              ? state
              : { beatIndex: 0, currentBeatId: null }
          }
          const anchorId = state.currentBeatId
          if (anchorId) {
            const remapped = beatIds.indexOf(anchorId)
            if (remapped >= 0) {
              return remapped === state.beatIndex
                ? state
                : { beatIndex: remapped }
            }
            // Beat removed: same index becomes the next remaining beat (or clamp).
            const clamped = Math.min(state.beatIndex, beatIds.length - 1)
            return {
              beatIndex: clamped,
              currentBeatId: beatIds[clamped] ?? null,
            }
          }
          const clamped = Math.min(state.beatIndex, beatIds.length - 1)
          return {
            beatIndex: clamped,
            currentBeatId: beatIds[clamped] ?? null,
          }
        }),
      setPlaySurface: (playSurface) => set({ playSurface }),
      openGrimoire: () =>
        set((state) => ({
          playSurface: 'grimoire' as const,
          grimoireReturnSurface:
            state.playSurface === 'bridge' ? ('bridge' as const) : ('coach' as const),
        })),
      returnFromGrimoire: () =>
        set((state) => ({
          playSurface: state.grimoireReturnSurface,
        })),
      setDemonBluffs: (roleIds) =>
        set((state) => {
          const eligible = new Set(
            eligibleBluffRoleIds(state.assignments, loadCatalog()),
          )
          const next = roleIds
            .filter((id) => eligible.has(id))
            .slice(0, 3)
          // Deduplicate while preserving order
          const seen = new Set<string>()
          const unique: string[] = []
          for (const id of next) {
            if (seen.has(id)) continue
            seen.add(id)
            unique.push(id)
          }
          return { demonBluffs: unique }
        }),
      toggleDemonBluff: (roleId) =>
        set((state) => {
          const eligible = new Set(
            eligibleBluffRoleIds(state.assignments, loadCatalog()),
          )
          if (!eligible.has(roleId)) return state
          if (state.demonBluffs.includes(roleId)) {
            return {
              demonBluffs: state.demonBluffs.filter((id) => id !== roleId),
            }
          }
          if (state.demonBluffs.length >= 3) return state
          return { demonBluffs: [...state.demonBluffs, roleId] }
        }),
      toggleDead: (playerId) =>
        set((state) => {
          if (!state.players.some((player) => player.id === playerId)) {
            return state
          }
          const isDead = state.deadPlayerIds.includes(playerId)
          if (isDead) {
            return {
              deadPlayerIds: state.deadPlayerIds.filter((id) => id !== playerId),
            }
          }
          const diedTonightIds = state.diedTonightIds.includes(playerId)
            ? state.diedTonightIds
            : [...state.diedTonightIds, playerId]
          return {
            deadPlayerIds: [...state.deadPlayerIds, playerId],
            diedTonightIds,
          }
        }),
      setPlayerReminders: (playerId, nextReminders) =>
        set((state) => {
          if (!state.players.some((player) => player.id === playerId)) {
            return state
          }
          const assignment = state.assignments[playerId]
          if (!assignment) {
            return state
          }
          const catalog = loadCatalog()
          const truthRoleId = assignment.trueRoleId ?? assignment.bagRoleId
          const role = catalog.roles.find((entry) => entry.id === truthRoleId)
          const allowed = new Set(role?.reminders ?? [])
          const seen = new Set<string>()
          const filtered: string[] = []
          for (const token of nextReminders) {
            if (!allowed.has(token) || seen.has(token)) continue
            seen.add(token)
            filtered.push(token)
          }
          return {
            reminders: { ...state.reminders, [playerId]: filtered },
          }
        }),
      startOtherNight: () =>
        set({
          nightKind: 'other',
          beatIndex: 0,
          currentBeatId: null,
          diedTonightIds: [],
          playSurface: 'coach',
        }),
    }),
    {
      name: SETUP_SESSION_STORAGE_KEY,
      version: 2,
      migrate: (persistedState, version) => {
        if (
          version < 2 &&
          persistedState != null &&
          typeof persistedState === 'object'
        ) {
          return {
            ...(persistedState as Record<string, unknown>),
            ...PLAY_FIELD_DEFAULTS,
          }
        }
        return persistedState as PersistedSetupSession
      },
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => partializedSession(state),
      merge: (persistedState, currentState) => {
        // Empty IndexedDB / first visit: zustand calls merge(undefined, current).
        // That is not a corrupt restore — keep the fresh in-memory session.
        if (persistedState == null) {
          return currentState
        }
        const parsed = PersistedSetupSessionSchema.safeParse(persistedState)
        if (!parsed.success) {
          return {
            ...currentState,
            ...freshSession(),
            hydrationError: true,
          }
        }
        const semantics = assertSetupSessionSemantics(
          parsed.data,
          loadCatalog(),
        )
        if (!semantics.ok) {
          return {
            ...currentState,
            ...freshSession(),
            hydrationError: true,
          }
        }
        return { ...currentState, ...parsed.data }
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || state?.hydrationError) {
          useSetupSessionStore.setState({
            ...freshSession(),
            hasHydrated: true,
            hydrationError: true,
          })
          return
        }
        useSetupSessionStore.setState({ hasHydrated: true })
      },
    },
  ),
)
