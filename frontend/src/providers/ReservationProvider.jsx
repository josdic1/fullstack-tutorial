import { useState, useEffect, useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function ReservationProvider({children}) {
    const { token, user } = useContext(AuthContext)  // ✅ Only declare once
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)

    const fetchReservations = async () => {
        if (!token || !user) {
            console.log('Skipping fetch - no token or user yet')
            return
        }
        
        try {
            const response = await fetch('http://localhost:5555/api/reservations', {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            if (response.ok) {
                const data = await response.json()
                setReservations(data.reservations)
                setError(null)
            }
        } catch (error) {
            console.error('Error:', error)
            setError('Cannot connect to server')
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [token, user])

    const createReservation = async (reservationData) => {
  
        
        try {
            const response = await fetch('http://localhost:5555/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            })
            
            if (response.ok) {
                const { reservation } = await response.json()
                setReservations(prev => [...prev, reservation])
                return true
            }
            return false
        } catch (error) {
            console.error('Error creating reservation:', error)
            return false
        }
    }

    const updateReservation = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:5555/api/reservations/${updatedData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            })
            
            if (response.ok) {
                const { reservation } = await response.json()
                setReservations(prev => prev.map(r => r.id === updatedData.id ? reservation : r))
                return true
            }
            
            console.error('Update failed:', response.status)
            return false
            
        } catch (error) {
            console.error('Error updating reservation:', error)
            return false
        }
    }

    const deleteReservation = async (id) => {
        try {
            const response = await fetch(`http://localhost:5555/api/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                setReservations(prev => prev.filter(r => r.id !== id))
                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting reservation:', error)
            return false
        }
    }

    return (
        <ReservationContext.Provider 
            value={{ reservations, error, fetchReservations, createReservation, updateReservation, deleteReservation }}>
            {children}
        </ReservationContext.Provider>
    )
}

export default ReservationProvider