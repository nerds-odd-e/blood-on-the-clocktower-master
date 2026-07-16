import { BrowserRouter } from 'react-router-dom'
import { PhoneShell } from './layout/PhoneShell'
import { AppRoutes } from './routes'

/**
 * App root: PhoneShell chrome + shallow routes.
 */
export default function App() {
  // Vite BASE_URL ends with `/`; React Router basename must not.
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

  return (
    <BrowserRouter basename={basename}>
      <PhoneShell>
        <AppRoutes />
      </PhoneShell>
    </BrowserRouter>
  )
}
