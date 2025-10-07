import { useState } from 'react'  // ✅ Add this
import { Outlet } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider'
import ReservationProvider from './providers/ReservationProvider'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import './components/Toast.css'

function App() {
  const [toast, setToast] = useState(null)  // ✅ Add this

  const showToast = (message, type = 'success') => {  // ✅ Add this
    setToast({ message, type })
  }

  return (
    <AuthProvider>
      <ReservationProvider>
        <Navbar />
        {toast && (  // ✅ Add this
          <Toast 
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
   <main style={{ minHeight: 'calc(100vh - 80px)' }}>  {/* 80px = navbar height */}
  <Outlet context={{ showToast }} />
</main>
      </ReservationProvider>
    </AuthProvider>
  )
}

export default App