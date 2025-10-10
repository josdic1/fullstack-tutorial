import { useState, useContext } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import ReservationContext from "../contexts/ReservationContext"
import ReservationCard from "../components/ReservationCard"

function ReservationList({ reservations = [] }) {
    const { deleteReservation } = useContext(ReservationContext)
    const { showToast } = useOutletContext()
    const navigate = useNavigate()

    // Filter state
    const [filters, setFilters] = useState({
        searchText: '',
        statuses: ['pending', 'confirmed', 'cancelled']
    })

    const handleSearchChange = (e) => {
        setFilters(prev => ({
            ...prev,
            searchText: e.target.value
        }))
    }

    const toggleStatus = (status) => {
        setFilters(prev => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status]
        }))
    }

    // Apply filters
    const filteredReservations = reservations.filter(reservation => {
        if (!filters.statuses.includes(reservation.status)) {
            return false
        }
        
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase()
            const notesLower = (reservation.notes || '').toLowerCase()
            
            if (!notesLower.includes(searchLower)) {
                return false
            }
        }
        
        return true
    })

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
        <div>
            {/* Clean Filter Bar */}
            <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '30px',
                    flexWrap: 'wrap'
                }}>
                    {/* Search */}
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <input 
                            type="text"
                            value={filters.searchText}
                            onChange={handleSearchChange}
                            placeholder="Search notes..."
                            style={{ 
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                    
                    {/* Status Toggles */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '15px'
                    }}>
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>Status:</span>
                        
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            <input 
                                type="checkbox"
                                checked={filters.statuses.includes('pending')}
                                onChange={() => toggleStatus('pending')}
                            />
                            Pending
                        </label>
                        
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            <input 
                                type="checkbox"
                                checked={filters.statuses.includes('confirmed')}
                                onChange={() => toggleStatus('confirmed')}
                            />
                            Confirmed
                        </label>
                        
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            <input 
                                type="checkbox"
                                checked={filters.statuses.includes('cancelled')}
                                onChange={() => toggleStatus('cancelled')}
                            />
                            Cancelled
                        </label>
                    </div>
                    
                    {/* Clear button */}
                    <button 
                        onClick={() => setFilters({
                            searchText: '',
                            statuses: ['pending', 'confirmed', 'cancelled']
                        })}
                        style={{ 
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Clear
                    </button>
                </div>
                
                {/* Results count */}
                <div style={{ 
                    marginTop: '10px',
                    fontSize: '13px',
                    color: '#6c757d'
                }}>
                    Showing {filteredReservations.length} of {reservations.length} reservations
                </div>
            </div>

            {/* Your existing table - UNCHANGED */}
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
                    {filteredReservations.map(reservation => (
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
        </div>
    )
}

export default ReservationList