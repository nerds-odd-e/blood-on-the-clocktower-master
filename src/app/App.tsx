import { BrowserRouter } from 'react-router-dom'
import { PhoneShell } from './layout/PhoneShell'
import { AppRoutes } from './routes'

/**
 * App root: PhoneShell chrome + shallow routes.
 */
export default function App() {
  return (
    <BrowserRouter>
      <PhoneShell>
        <AppRoutes />
      </PhoneShell>
    </BrowserRouter>
  )
}
