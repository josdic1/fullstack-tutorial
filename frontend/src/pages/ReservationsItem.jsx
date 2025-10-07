import { useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReservationContext from "../contexts/ReservationContext"

function ReservationItem() {
    const { id } = useParams()
    const { reservations, deleteReservation } = useContext(ReservationContext)
    const navigate = useNavigate()
    
    const reservation = reservations.find(r => r.id === parseInt(id))
    
    if (!reservation) {
        return (
            <div style={{ padding: '40px' }}>
                <h2>Reservation Not Found</h2>
                <button onClick={() => navigate('/reservations')}>Back to Reservations</button>
            </div>
        )
    }
    
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            const success = await deleteReservation(reservation.id)
            if (success) {
                navigate('/reservations')
            }
        }
    }
    
    return (
        <div style={{ padding: '40px', maxWidth: '600px' }}>
            <h2>Reservation Details</h2>
            
            <div style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                <p><strong>ID:</strong> {reservation.id}</p>
                <p><strong>Member ID:</strong> {reservation.member_id}</p>
                <p><strong>Date:</strong> {reservation.reservation_date}</p>
                <p><strong>Time:</strong> {reservation.reservation_time}</p>
                <p><strong>Party Size:</strong> {reservation.party_size}</p>
                <p><strong>Status:</strong> {reservation.status}</p>
                <p><strong>Notes:</strong> {reservation.notes || 'None'}</p>
                <p><strong>Created:</strong> {reservation.created_at}</p>
                <p><strong>Last Updated:</strong> {reservation.updated_at}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate(`/reservations/${id}/edit`)}>
                    Edit
                </button>
                <button onClick={handleDelete} style={{ background: '#dc3545', color: 'white' }}>
                    Delete
                </button>
                <button onClick={() => navigate('/reservations')}>
                    Back
                </button>
            </div>
        </div>
    )
}

export default ReservationItem