import { z } from 'zod'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { buildBag, type BagPlan } from '../domain/bag'
import type { Assignment } from '../domain/grimoire'
import { loadCatalog } from '../domain/script'
import { idbStorage } from './idbStorage'

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

const PersistedSetupSessionSchema = z.object({
  wizardStep: WizardStepSchema,
  players: z.array(SetupPlayerSchema).max(15),
  difficulty: DifficultySchema,
  bag: BagPlanSchema.nullable(),
  assignments: z.record(z.string(), AssignmentSchema),
})

export type WizardStep = z.infer<typeof WizardStepSchema>
export type Difficulty = z.infer<typeof DifficultySchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type PlayerAge = z.infer<typeof AgeSchema>
export type SetupPlayer = z.infer<typeof SetupPlayerSchema>

type PersistedSetupSession = z.infer<typeof PersistedSetupSessionSchema>

type SetupSessionState = PersistedSetupSession & {
  hasHydrated: boolean
  hydrationError: boolean
  setWizardStep: (wizardStep: WizardStep) => void
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
}

const freshSession = (): PersistedSetupSession => ({
  wizardStep: 'script',
  players: [],
  difficulty: 'standard',
  bag: null,
  assignments: {},
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
    (set) => ({
      ...freshSession(),
      hasHydrated: false,
      hydrationError: false,
      setWizardStep: (wizardStep) => set({ wizardStep }),
      setDifficulty: (difficulty) =>
        set({ difficulty, bag: null, assignments: {} }),
      generateBag: () =>
        set((state) => {
          const bag: BagPlan = buildBag({
            playerCount: state.players.length,
            difficulty: state.difficulty,
            catalog: loadCatalog(),
          })
          return { bag, assignments: {}, wizardStep: 'bag' }
        }),
      clearBag: () => set({ bag: null, assignments: {} }),
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
          return {
            assignments: { ...state.assignments, [playerId]: assignment },
          }
        }),
      clearRole: (playerId) =>
        set((state) => {
          if (!state.assignments[playerId]) return state
          const assignments = { ...state.assignments }
          delete assignments[playerId]
          return { assignments }
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
          return {
            players: state.players.filter((player) => player.id !== id),
            assignments,
          }
        }),
      resetFresh: () => set({ ...freshSession() }),
      clearHydrationError: () => set({ hydrationError: false }),
    }),
    {
      name: 'st-copilot-setup-session',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        wizardStep: state.wizardStep,
        players: state.players,
        difficulty: state.difficulty,
        bag: state.bag,
        assignments: state.assignments,
      }),
      merge: (persistedState, currentState) => {
        const parsed = PersistedSetupSessionSchema.safeParse(persistedState)
        if (!parsed.success) {
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
