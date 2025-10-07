import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

function Home() {
  const { user, logout } = useContext(AuthContext)

  console.log('Home component - user:', user)  // ← Add this

  if (!user) {
    console.log('No user, redirecting to login')  // ← Add this
    return <Navigate to="/login" />
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1> Home Page </h1>
      <p>Welcome, {user.full_name}!</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Home