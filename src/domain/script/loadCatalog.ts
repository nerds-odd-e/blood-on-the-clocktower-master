/**
 * Trouble Brewing catalog loader.
 *
 * Setup-chart rows (playerCount 5–15) are locked to the distribution table in
 * `.planning/phases/01-phone-shell-tb-catalog/01-RESEARCH.md` (assumption A1 /
 * official sheet transcription path — RESOLVED). Source note lives here, not
 * inside the JSON payload.
 *
 * Role field shape and night ordinals curated from the bra1n/townsquare
 * interchange `roles.json` (edition "tb", travelers excluded) — 22 characters.
 * Cross-check sample: Poisoner firstNight (17) precedes information townsfolk
 * wakes (Washerwoman 33+) and Spy (49); Imp firstNight is 0 (Demon Info is a
 * procedural beat, not a role wake).
 */
import rolesJson from '../../data/scripts/trouble-brewing/roles.json'
import setupChartJson from '../../data/scripts/trouble-brewing/setup-chart.json'
import proceduralBeatsJson from '../../data/scripts/trouble-brewing/procedural-beats.json'
import coachCopyJson from '../../data/scripts/trouble-brewing/coach-copy.json'
import {
  CatalogSchema,
  CoachCopySchema,
  ProceduralBeatsSchema,
  SetupChartSchema,
  type Role,
  type TroubleBrewingCatalog,
} from './schemas'

export type TeamCounts = {
  townsfolk: number
  outsider: number
  minion: number
  demon: number
}

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
  const proceduralBeats = ProceduralBeatsSchema.parse(proceduralBeatsJson).beats
  const coachCopy = CoachCopySchema.parse(coachCopyJson).entries

  const catalog = CatalogSchema.parse({
    scriptId: 'trouble-brewing',
    roles,
    setupChart,
    proceduralBeats,
    coachCopy,
  })

  return {
    ...catalog,
    teamCounts: summarizeTeamCounts(catalog.roles),
  }
}
