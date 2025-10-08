import { useState, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ReservationContext from '../contexts/ReservationContext'
import ReservationList from '../components/ReservationList'

function Home() {
  const { user, logout } = useContext(AuthContext)
  const { reservations, loading } = useContext(ReservationContext)


  if (!user) {
    return <Navigate to="/login" />
  }


  return (
    <>
      <div style={{ padding: '40px' }}>
        <h1>Home Page</h1>
        <p>Welcome, {user.full_name}!</p>
        <p>Email: {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ padding: '40px' }}>
      
        
        <h2>All Reservations</h2>
        
        {loading ? (
          <p>Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <>
            <p>Showing {reservations.length} reservations</p>
            <ReservationList reservations={reservations} />
          </>
        )}
      </div>
    </>
  )
}

export default Home