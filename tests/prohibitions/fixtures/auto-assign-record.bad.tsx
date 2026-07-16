export function RecordStep() {
  for (const player of players) {
    assignRole(player.id, tokens.pop())
  }
  return null
}

declare const players: Array<{ id: string }>
declare const tokens: string[]
declare function assignRole(playerId: string, roleId: string): void
