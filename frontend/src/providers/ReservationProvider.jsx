import { useState, useEffect, useContext, useCallback } from "react"  // ✅ One import only
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function ReservationProvider({children}) {
    const { token } = useContext(AuthContext)
    const [reservations, setReservations] = useState([])

    const fetchReservations = useCallback(async () => {
        if (!token) return
        
        try {
            const response = await fetch('http://localhost:5555/api/reservations', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setReservations(data.reservations)
            } else {
                console.error('Failed to fetch reservations')
            }
        } catch (error) {
            console.error('Error fetching reservations:', error)
        }
    }, [token])

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
            const { reservation } = await response.json()  // ✅ Destructure
            setReservations(prev => [...prev, reservation])  // ✅ Use reservation
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
            return true  // ✅ Success
        }
        
        // ❌ ADD THIS - explicitly return false on failure
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
            value={{ reservations, fetchReservations, createReservation, updateReservation, deleteReservation }}>
            {children}
        </ReservationContext.Provider>
    )
}

export default ReservationProvider