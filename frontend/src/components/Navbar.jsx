import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  const navigate = useNavigate()

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '20px',
      background: '#333',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        <h1>Catering App</h1>
      </Link>

      <div>
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>Welcome, {user.full_name}</span>
            <button onClick={() => navigate('new')} style={{ padding: '5px 15px' }}>
              New Reservation
            </button>
            <button onClick={logout} style={{ padding: '5px 15px' }}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ color: 'white', padding: '5px 15px' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar