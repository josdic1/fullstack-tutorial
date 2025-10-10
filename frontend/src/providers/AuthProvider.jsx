import { useState, useEffect } from 'react'
import AuthContext from '../contexts/AuthContext'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)  // Add loading state

  // Load user on app startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:5555/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setToken(storedToken)
          } else {
            // Token expired or invalid, clear it
            localStorage.removeItem('token')
          }
        } catch (err) {
          console.error('Failed to load user:', err)
        }
      }
      
      setLoading(false)
    }
    
    
    loadUser()
  }, [])

  

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5555/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.member)
        setToken(data.access_token)
        localStorage.setItem('token', data.access_token)
        
        return { 
          success: true, 
          user: data.member 
        }
      } else {
        return { 
          success: false, 
          error: data.error 
        }
      }
    } catch (err) {
      return { 
        success: false, 
        error: 'Cannot connect to server' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    
  }

if (loading) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5',  // ✅ Match body color
      fontSize: '20px',
      color: '#333'
    }}>
      <div>
        <p>Loading...</p>
      </div>
    </div>
  )
}

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider