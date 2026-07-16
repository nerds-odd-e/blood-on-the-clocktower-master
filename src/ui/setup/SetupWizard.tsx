import { useSetupSessionStore } from '../../state/setupSessionStore'
import { DifficultyStep } from './steps/DifficultyStep'
import { BagStep } from './steps/BagStep'
import { PlayersStep } from './steps/PlayersStep'
import { ScriptStep } from './steps/ScriptStep'
import { DealStep } from './steps/DealStep'
import { RecordStep } from './steps/RecordStep'

export function SetupWizard() {
  const wizardStep = useSetupSessionStore((state) => state.wizardStep)
  const hasHydrated = useSetupSessionStore((state) => state.hasHydrated)
  const hydrationError = useSetupSessionStore((state) => state.hydrationError)
  const clearHydrationError = useSetupSessionStore(
    (state) => state.clearHydrationError,
  )
  const setWizardStep = useSetupSessionStore((state) => state.setWizardStep)

  if (!hasHydrated) {
    return (
      <div
        className="min-h-dvh bg-[var(--color-dominant)]"
        aria-busy="true"
        aria-label="Restoring setup"
      />
    )
  }

  return (
    <div className="min-w-0 overflow-x-hidden">
      {hydrationError ? (
        <div
          className="mt-4 rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4 text-body"
          role="alert"
        >
          Couldn’t restore your setup. Starting fresh — re-enter players if
          needed.
        </div>
      ) : null}

      {wizardStep === 'script' ? (
        <ScriptStep
          onContinue={() => {
            clearHydrationError()
            setWizardStep('players')
          }}
        />
      ) : null}
      {wizardStep === 'players' ? <PlayersStep /> : null}
      {wizardStep === 'difficulty' ? <DifficultyStep /> : null}
      {wizardStep === 'bag' ? <BagStep /> : null}
      {wizardStep === 'deal' ? (
        <DealStep
          onBack={() => setWizardStep('bag')}
          onContinue={() => setWizardStep('record')}
        />
      ) : null}
      {wizardStep === 'record' ? (
        <RecordStep onBack={() => setWizardStep('deal')} />
      ) : null}
    </div>
  )
}
