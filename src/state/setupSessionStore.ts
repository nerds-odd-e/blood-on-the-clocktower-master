import { z } from 'zod'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
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
  bag: z.null(),
  assignments: z.record(z.string(), z.unknown()),
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

export const useSetupSessionStore = create<SetupSessionState>()(
  persist(
    (set) => ({
      ...freshSession(),
      hasHydrated: false,
      hydrationError: false,
      setWizardStep: (wizardStep) => set({ wizardStep }),
      setDifficulty: (difficulty) => set({ difficulty }),
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
        set((state) => ({
          players: state.players.filter((player) => player.id !== id),
        })),
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
