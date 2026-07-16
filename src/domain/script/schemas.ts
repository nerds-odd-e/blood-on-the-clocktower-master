import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  edition: z.literal('tb'),
  team: z.enum(['townsfolk', 'outsider', 'minion', 'demon']),
  ability: z.string(),
  firstNight: z.number().int().nonnegative(),
  otherNight: z.number().int().nonnegative(),
  firstNightReminder: z.string(),
  otherNightReminder: z.string(),
  reminders: z.array(z.string()).default([]),
  setup: z.boolean(),
})

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

export const SetupChartSchema = z.object({
  rows: z
    .array(SetupChartRowSchema)
    .length(11)
    .refine(
      (rows) => {
        const counts = rows.map((r) => r.playerCount).sort((a, b) => a - b)
        return counts.every((c, i) => c === 5 + i)
      },
      { message: 'setup chart must cover playerCount 5–15 exactly once each' },
    ),
})

export const ProceduralBeatSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  phase: z.string().min(1),
  ordinal: z.number().int().nonnegative(),
  notes: z.string(),
})

export const ProceduralBeatsSchema = z.object({
  beats: z.array(ProceduralBeatSchema).min(1),
})

export const CoachCopyEntrySchema = z.object({
  id: z.string().min(1),
  short: z.string().min(1),
  detail: z.string().min(1),
  nightKind: z.enum(['first', 'other']).optional(),
})

export const CoachCopySchema = z.object({
  entries: z.array(CoachCopyEntrySchema).min(1),
})

export const CatalogSchema = z.object({
  scriptId: z.literal('trouble-brewing'),
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
  setupChart: SetupChartSchema.shape.rows,
  proceduralBeats: ProceduralBeatsSchema.shape.beats,
  coachCopy: CoachCopySchema.shape.entries,
})

export type Role = z.infer<typeof RoleSchema>
export type SetupChartRow = z.infer<typeof SetupChartRowSchema>
export type ProceduralBeat = z.infer<typeof ProceduralBeatSchema>
export type CoachCopyEntry = z.infer<typeof CoachCopyEntrySchema>
export type TroubleBrewingCatalog = z.infer<typeof CatalogSchema>
