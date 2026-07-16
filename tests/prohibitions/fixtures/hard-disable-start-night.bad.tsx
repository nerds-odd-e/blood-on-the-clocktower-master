export function RecordStep() {
  const incomplete = true
  return (
    <button type="button" disabled={incomplete}>
      Start night
    </button>
  )
}
