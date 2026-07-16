import { Route, Routes } from 'react-router-dom'
import { ScriptHome } from '../ui/home/ScriptHome'
import { SetupWizard } from '../ui/setup/SetupWizard'
import { PlayStub } from '../ui/play/PlayStub'

/**
 * Shallow route table: /, /setup, /play (D-09).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ScriptHome />} />
      <Route path="/setup" element={<SetupWizard />} />
      <Route path="/play" element={<PlayStub />} />
    </Routes>
  )
}
