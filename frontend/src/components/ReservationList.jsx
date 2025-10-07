import { useContext } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"  // ✅ Add useOutletContext
import ReservationContext from "../contexts/ReservationContext"
import ReservationCard from "../pages/ReservationCard"

function ReservationList({ reservations = [] }) {
    const { deleteReservation } = useContext(ReservationContext)
    const { showToast } = useOutletContext()  // ✅ Get toast function
    const navigate = useNavigate()

    const handleDelete = async (id) => {  // ✅ Make it async
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            const success = await deleteReservation(id)
            
            if (success) {
                showToast('Reservation deleted successfully!', 'success')  // ✅ Success toast
            } else {
                showToast('Failed to delete reservation', 'error')  // ✅ Error toast
            }
        }
    }

    return (
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
                {reservations.map(reservation => (
                    <ReservationCard 
                        key={reservation.id}
                        reservation={reservation}
                        onSelect={() => navigate(`/reservations/${reservation.id}`)}
                        onUpdate={() => navigate(`/reservations/${reservation.id}/edit`)}
                        onDelete={() => handleDelete(reservation.id)}  // ✅ Use handleDelete
                    />
                ))}
            </tbody>
        </table>
    )
}

export default ReservationList