export function RecordStep({ onStartNight }: { onStartNight: () => void }) {
  return (
    <button type="button" onClick={() => onStartNight()}>
      Start night
    </button>
  )
}
