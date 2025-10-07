import { Outlet } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider'
import Navbar from './components/Navbar'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </AuthProvider>
  )
}

export default App