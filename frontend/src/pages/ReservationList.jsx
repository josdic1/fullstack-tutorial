import { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ReservationContext from "../contexts/ReservationContext"
import ReservationCard from "./ReservationCard"

function ReservationList() {

    const { reservations, fetchReservations, deleteReservation } = useContext(ReservationContext)

    const navigate = useNavigate()


    useEffect(() => {
        fetchReservations()
    }, [])

    const reservationsItems = reservations.map(reservation => (
            <ReservationCard 
                key={reservation.id} 
                reservation={reservation}
                onSelect={() => navigate(`/reservations/${reservation.id}`)}
                onUpdate={() => navigate(`/reservations/${reservation.id}/edit`)}
                onDelete={() => {
                if (confirm('Are you sure you want to delete this reservation?')) {
        deleteReservation(reservation.id)
    }
}} 
            />
        ))

return (
<>
<table>
    <thead>
        <tr>
            <th>Mem ID#</th>
            <th>Date</th>
            <th>Time</th>
            <th>Party</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Created on</th>
            <th>Modified on</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {reservationsItems}
    </tbody>
    
</table>
</>
)}

export default ReservationList
