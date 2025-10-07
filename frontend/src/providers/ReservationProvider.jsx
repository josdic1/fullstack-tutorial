import { useState, useEffect, useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function ReservationProvider({children}) {
    const { token, user } = useContext(AuthContext)
    const [reservations, setReservations] = useState([])

console.log(reservations)

    useEffect(() => {
        // Fetch reservations from API when component mounts
        fetchReservations()
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
            }
        } catch (error) {
            console.error('Error creating reservation:', error)
        }
        console.log('Sending:', reservationData)
    }

    

return (
<>
    <ReservationContext.Provider 
        value={{ reservations, fetchReservations, createReservation }}>
            {children}
    </ReservationContext.Provider>
</>
)}

export default ReservationProvider