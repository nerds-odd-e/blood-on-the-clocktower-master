import type { LoadedCatalog } from '../script'

export type Difficulty = 'easy' | 'standard' | 'hard'

export type BagComposition = {
  townsfolk: number
  outsiders: number
  minions: number
  demons: number
}

export type BagPlan = {
  tokens: string[]
  composition: BagComposition
  drunk: { coverRoleId: string } | null
  setupNotes: string[]
  whyNote: string
}

export type BuildBagInput = {
  playerCount: number
  difficulty: Difficulty
  catalog: LoadedCatalog
  rng?: () => number
}

export type BagValidation = {
  ok: boolean
  issues: string[]
}
