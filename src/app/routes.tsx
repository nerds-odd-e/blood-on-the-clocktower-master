import { Route, Routes } from 'react-router-dom'
import { ScriptHome } from '../ui/home/ScriptHome'
import { SetupStub } from '../ui/setup/SetupStub'
import { PlayStub } from '../ui/play/PlayStub'

/**
 * Shallow route table: /, /setup, /play (D-09).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ScriptHome />} />
      <Route path="/setup" element={<SetupStub />} />
      <Route path="/play" element={<PlayStub />} />
    </Routes>
  )
}
