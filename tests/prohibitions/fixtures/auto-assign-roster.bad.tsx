export function PlayersStep() {
  assignRole('p1', 'imp')
  return null
}

declare function assignRole(playerId: string, roleId: string): void
