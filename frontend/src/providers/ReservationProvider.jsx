import { useState, useEffect, useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function ReservationProvider({children}) {
    const { token, user } = useContext(AuthContext)
    const [reservations, setReservations] = useState([])

console.log(reservations)

useEffect(() => {
    if (token) {  // ✅ Only fetch if token exists
        fetchReservations()
    }
}, [token])

    const fetchReservations = async () => {
    try {
        const response = await fetch('http://localhost:5555/api/reservations', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        
        if (response.ok) {  // ✅ Must check this
            const data = await response.json()
            setReservations(data.reservations)
        } else {
            console.error('Failed to fetch reservations')
            // Don't set reservations if request failed
        }
    } catch (error) {
        console.error('Error fetching reservations:', error)
        // Don't set reservations if request failed
    }
}

    const createReservation = async (reservationData) => {
    console.log('Sending:', reservationData)  // Move log to top
    
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
            const newReservation = await response.json()
            setReservations(prev => [...prev, newReservation])
            return true  // ✅ SUCCESS
        }
        return false  // ✅ FAILED
    } catch (error) {
        console.error('Error creating reservation:', error)
        return false  // ✅ ERROR
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
            const updatedReservation = await response.json()
            setReservations(prev => prev.map(r => r.id === updatedData.id ? updatedReservation : r))
            return true
        }
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
        
        if (response.ok) {  // ✅ Check if deletion was successful
            setReservations(prev => prev.filter(r => r.id !== id))
            return true  // ✅ SUCCESS
        }
        return false  // ✅ FAILED
    } catch (error) {
        console.error('Error deleting reservation:', error)
        return false  // ✅ ERROR
    }
}

    

return (
<>
    <ReservationContext.Provider 
        value={{ reservations, fetchReservations, createReservation, updateReservation, deleteReservation }}>
            {children}
    </ReservationContext.Provider>
</>
)}

export default ReservationProvider