import type { Role } from '../script'
import type { Difficulty } from './types'

export const WHY_NOTE: Record<Difficulty, string> = {
  easy: 'Prefers clearer info roles and a gentler evil mix for new tables.',
  standard: 'A balanced legal bag for a typical Trouble Brewing table.',
  hard: 'Leans into trickier roles and tougher evil while staying legal.',
}

const EASY_PREFERRED = new Set([
  'washerwoman',
  'librarian',
  'chef',
  'empath',
  'fortuneteller',
  'undertaker',
  'monk',
  'virgin',
  'recluse',
  'scarletwoman',
])
const EASY_DOWNWEIGHTED = new Set([
  'baron',
  'poisoner',
  'spy',
  'saint',
  'slayer',
])
const HARD_PREFERRED = new Set([
  'baron',
  'poisoner',
  'spy',
  'saint',
  'drunk',
  'slayer',
  'mayor',
])

export function roleWeight(role: Role, difficulty: Difficulty): number {
  if (difficulty === 'easy') {
    if (EASY_PREFERRED.has(role.id)) return 5
    if (EASY_DOWNWEIGHTED.has(role.id)) return 1
    return 3
  }
  if (difficulty === 'hard') {
    return HARD_PREFERRED.has(role.id) ? 6 : 2
  }
  return role.firstNight > 0 ? 4 : 3
}

export function pickWeightedRoles(
  roles: Role[],
  count: number,
  difficulty: Difficulty,
  rng: () => number,
): Role[] {
  if (count < 0 || count > roles.length) {
    throw new Error(`Cannot pick ${count} roles from a pool of ${roles.length}`)
  }

  const pool = [...roles]
  const picked: Role[] = []
  while (picked.length < count) {
    const totalWeight = pool.reduce(
      (total, role) => total + roleWeight(role, difficulty),
      0,
    )
    const sample = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON)
    let cursor = sample * totalWeight
    let selectedIndex = pool.length - 1
    for (let index = 0; index < pool.length; index += 1) {
      cursor -= roleWeight(pool[index], difficulty)
      if (cursor < 0) {
        selectedIndex = index
        break
      }
    }
    picked.push(pool.splice(selectedIndex, 1)[0])
  }
  return picked
}
