import { Outlet } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider'

function App() {
  return (
    <>
      <header style={{ padding: '20px', background: '#333', color: 'white' }}>
        <h1>Catering App</h1>
      </header>
      <AuthProvider>
      <main>
        <Outlet />
      </main>
    </AuthProvider>
    </>
  )
}

export default App