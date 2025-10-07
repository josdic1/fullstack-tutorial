import { useState } from 'react'
import AuthContext from '../contexts/AuthContext'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  const login = async (username, password) => {
    const response = await fetch('http://localhost:5555/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()
    if (response.ok) {
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('token', data.token)
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }

    const logout = () => {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
    }

    return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    )         
  }

}

export default AuthProvider
