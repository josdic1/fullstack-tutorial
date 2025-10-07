import { Outlet } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider'
import ReservationProvider from './providers/ReservationProvider'
import Navbar from './components/Navbar'

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
      <Navbar />
      <main>
        <Outlet />
      </main>
      </ReservationProvider>
    </AuthProvider>
  )
}

export default App