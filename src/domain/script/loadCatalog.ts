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
 */
import rolesJson from '../../data/scripts/trouble-brewing/roles.json'
import setupChartJson from '../../data/scripts/trouble-brewing/setup-chart.json'
import proceduralBeatsJson from '../../data/scripts/trouble-brewing/procedural-beats.json'
import {
  CatalogSchema,
  ProceduralBeatsSchema,
  SetupChartSchema,
  type TroubleBrewingCatalog,
} from './schemas'

export function loadCatalog(): TroubleBrewingCatalog {
  const roles = CatalogSchema.shape.roles.parse(rolesJson)
  const setupChart = SetupChartSchema.parse(setupChartJson).rows
  const proceduralBeats = ProceduralBeatsSchema.parse(proceduralBeatsJson).beats

  return CatalogSchema.parse({
    scriptId: 'trouble-brewing',
    roles,
    setupChart,
    proceduralBeats,
  })
}
