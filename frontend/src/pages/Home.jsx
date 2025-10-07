import { useState, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ReservationContext from '../contexts/ReservationContext'
import ReservationList from '../components/ReservationList'

function Home() {
  const { user, logout } = useContext(AuthContext)
  const { reservations } = useContext(ReservationContext)
  
  
  
  const userReservations = reservations.filter(r => r.member_id === user?.id)
  
 
  
  const [showOnlyMine, setShowOnlyMine] = useState(true)

  if (!user) {
    return <Navigate to="/login" />
  }

  const displayedReservations = showOnlyMine ? userReservations : reservations

  return (
    <>
      <div style={{ padding: '40px' }}>
        <h1>Home Page</h1>
        <p>Welcome, {user.full_name}!</p>
        <p>Email: {user.email}</p>
        <p>Your ID: {user.id}</p>  {/* ✅ Show the ID */}
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ padding: '40px' }}>
        <button onClick={() => setShowOnlyMine(!showOnlyMine)}>
          {showOnlyMine ? 'Show All Reservations' : 'Show My Reservations'}
        </button>
        
        <h2>{showOnlyMine ? 'Your Reservations' : 'All Reservations'}</h2>
        <p>Showing {displayedReservations.length} reservations</p>  {/* ✅ Show count */}
        
        {displayedReservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <ReservationList reservations={displayedReservations} />
        )}
      </div>
    </>
  )
}

export default Home