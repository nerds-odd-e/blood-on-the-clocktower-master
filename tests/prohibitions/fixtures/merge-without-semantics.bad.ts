export const merge = (persistedState: unknown, currentState: object) => {
  const parsed = { success: true, data: persistedState }
  if (!parsed.success) {
    return { ...currentState, hydrationError: true }
  }
  // Violation: shape-only merge, no assertSetupSessionSemantics
  return { ...currentState, ...parsed.data }
}
