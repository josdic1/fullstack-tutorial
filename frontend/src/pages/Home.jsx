import { useState, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ReservationContext from '../contexts/ReservationContext'
import ReservationList from '../components/ReservationList'

function Home() {
  const { user, logout } = useContext(AuthContext)
  const { reservations, loading } = useContext(ReservationContext)
  const [showOnlyMine, setShowOnlyMine] = useState(true)

  if (!user) {
    return <Navigate to="/login" />
  }

  const userReservations = reservations.filter(r => r.member_id === user.id)
  const displayedReservations = showOnlyMine ? userReservations : reservations

  return (
    <>
      <div style={{ padding: '40px' }}>
        <h1>Home Page</h1>
        <p>Welcome, {user.full_name}!</p>
        <p>Email: {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ padding: '40px' }}>
        {user.role === 'staff' && (
          <button onClick={() => setShowOnlyMine(!showOnlyMine)}>
            {showOnlyMine ? 'Show All Reservations' : 'Show My Reservations'}
          </button>
        )}
        
        <h2>{showOnlyMine ? 'Your Reservations' : 'All Reservations'}</h2>
        
        {loading ? (
          <p>Loading reservations...</p>
        ) : displayedReservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <>
            <p>Showing {displayedReservations.length} reservations</p>
            <ReservationList reservations={displayedReservations} />
          </>
        )}
      </div>
    </>
  )
}

export default Home