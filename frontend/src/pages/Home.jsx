import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ReservationContext from '../contexts/ReservationContext'
import ReservationList from './ReservationList'

function Home() {
  const { user, logout } = useContext(AuthContext)
  const { reservations } = useContext(ReservationContext)
  const userReservations = reservations.filter(r => r.user_id === user?.id)

  if (!user) {
    return <Navigate to="/login" />
  } 

  return (
    <>
    <div style={{ padding: '40px' }}>
      <h1> Home Page </h1>
      <p>Welcome, {user.full_name}!</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
    <div style={{ padding: '40px' }}>
      <ReservationList reservations={userReservations} />
    </div>
    </>
  )
}

export default Home