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
    
    // Calculate total fees
    const totalFees = reservation.fees?.reduce((sum, fee) => sum + parseFloat(fee.fee_applied), 0) || 0
    
    return (
        <div style={{ padding: '40px', maxWidth: '800px' }}>
            <h2>Reservation Details</h2>
            
            {/* Basic Info */}
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h3>Information</h3>
                <p><strong>ID:</strong> {reservation.id}</p>
                <p><strong>Member ID:</strong> {reservation.member_id}</p>
                <p><strong>Date:</strong> {reservation.reservation_date}</p>
                <p><strong>Time:</strong> {reservation.reservation_time}</p>
                <p><strong>Party Size:</strong> {reservation.party_size}</p>
                <p><strong>Status:</strong> <span style={{ 
                    textTransform: 'capitalize',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: reservation.status === 'confirmed' ? '#d4edda' : 
                               reservation.status === 'cancelled' ? '#f8d7da' : '#fff3cd'
                }}>{reservation.status}</span></p>
                <p><strong>Current Notes:</strong> {reservation.notes || 'None'}</p>
                <p><strong>Created:</strong> {reservation.created_at}</p>
                <p><strong>Last Updated:</strong> {reservation.updated_at}</p>
            </div>
            
            {/* Fees Section */}
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h3>Fees</h3>
                {reservation.fees && reservation.fees.length > 0 ? (
                    <>
                        <table style={{ width: '100%', marginBottom: '10px' }}>
                            <thead>
                                <tr>
                                    <th>Rule</th>
                                    <th>Amount</th>
                                    <th>Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservation.fees.map(fee => (
                                    <tr key={fee.id}>
                                        <td>Rule #{fee.rule_id}</td>
                                        <td>${parseFloat(fee.fee_applied).toFixed(2)}</td>
                                        <td>{new Date(fee.calculated_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            textAlign: 'right',
                            borderTop: '2px solid #333',
                            paddingTop: '10px'
                        }}>
                            Total Fees: ${totalFees.toFixed(2)}
                        </p>
                    </>
                ) : (
                    <p>No fees applied to this reservation.</p>
                )}
            </div>
            
            {/* Notes History Section */}
            <div style={{ 
                background: 'white', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h3>Notes History</h3>
                {reservation.member_notes && reservation.member_notes.length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {reservation.member_notes
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Newest first
                            .map(note => (
                                <div key={note.id} style={{ 
                                    padding: '12px',
                                    borderLeft: '3px solid #007bff',
                                    background: '#f9f9f9',
                                    marginBottom: '10px'
                                }}>
                                    <p style={{ margin: '0 0 5px 0' }}><strong>{note.note_text}</strong></p>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '12px', 
                                        color: '#666' 
                                    }}>
                                        by {note.member?.full_name || 'Unknown'} on {new Date(note.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>No notes history.</p>
                )}
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate(`/reservations/${id}/edit`)}>
                    Edit Reservation
                </button>
                <button onClick={handleDelete} style={{ background: '#dc3545' }}>
                    Delete Reservation
                </button>
                <button onClick={() => navigate('/reservations')} type="button">
                    Back to List
                </button>
            </div>
        </div>
    )
}

export default ReservationItem