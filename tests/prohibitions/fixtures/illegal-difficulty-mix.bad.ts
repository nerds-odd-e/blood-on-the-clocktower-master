export function buildBag() {
  // Violation: returns a draft without validateBag
  return {
    tokens: ['imp', 'imp', 'imp', 'imp', 'imp'],
    composition: { townsfolk: 0, outsiders: 0, minions: 0, demons: 5 },
  }
}
