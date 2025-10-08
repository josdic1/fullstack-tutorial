import { useState, useEffect, useContext, useCallback } from "react"
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function ReservationProvider({children}) {
    const { token, user } = useContext(AuthContext)  // ✅ Get user too
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState(null)  // ✅ Track errors

    const fetchReservations = useCallback(async () => {
        if (!token || !user) {  // ✅ Wait for BOTH token and user
            console.log('Skipping fetch - no token or user yet')
            return
        }
        
        console.log('Fetching reservations for user:', user.username, 'role:', user.role)  // ✅ Debug log
        
        try {
            const response = await fetch('http://localhost:5555/api/reservations', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                console.log('Fetched reservations:', data.reservations.length)  // ✅ Debug log
                setReservations(data.reservations)
                setError(null)
            } else {
                const errorData = await response.json()
                console.error('Failed to fetch reservations:', response.status, errorData)
                setError(errorData.error || 'Failed to fetch reservations')  // ✅ Store error
            }
        } catch (error) {
            console.error('Error fetching reservations:', error)
            setError('Cannot connect to server')  // ✅ Store error
        }
    }, [token, user])  // ✅ Depend on both token and user

    useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const createReservation = async (reservationData) => {
        console.log('Sending:', reservationData)
        
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