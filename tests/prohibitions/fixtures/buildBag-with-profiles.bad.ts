export function generateBag(state: {
  players: Array<{ experience?: string; age?: string; notes?: string }>
}) {
  return buildBag({
    playerCount: state.players.length,
    difficulty: 'standard',
    catalog: {},
    experience: state.players.map((p) => p.experience),
    age: state.players.map((p) => p.age),
    notes: state.players.map((p) => p.notes),
  })
}

declare function buildBag(input: Record<string, unknown>): unknown
