import { useContext } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import ReservationContext from "../contexts/ReservationContext"
import ReservationCard from "../components/ReservationCard"

function ReservationList({ reservations = [] }) {
    const { deleteReservation } = useContext(ReservationContext)
    const { showToast } = useOutletContext()
    const navigate = useNavigate()

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            const success = await deleteReservation(id)
            
            if (success) {
                showToast('Reservation deleted successfully!', 'success')
            } else {
                showToast('Failed to delete reservation', 'error')
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
                    <th>Fees</th>
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
                        onDelete={() => handleDelete(reservation.id)}
                    />
                ))}
            </tbody>
        </table>
    )
}

export default ReservationList