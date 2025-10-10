import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"  
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function EditReservation() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const { reservations, updateReservation } = useContext(ReservationContext)
    const { showToast } = useOutletContext()
    
    const [formData, setFormData] = useState({
        reservation_date: '',
        reservation_time: '',
        party_size: 1,
        notes: '', 
        status: 'pending'  
    })
    
    const navigate = useNavigate()

    // Define your pricing structure
    const CHARGE_PER_PERSON = 25 // $25 per person
    const OVERAGE_THRESHOLD = 10 // Parties larger than 10 incur overage fee
    const OVERAGE_FEE = 50 // Flat $50 fee for large parties
    const WEEKEND_SURCHARGE = 10 // Additional $10 on weekends

    // Calculate total charges
    const calculateCharges = () => {
        let total = formData.party_size * CHARGE_PER_PERSON
        
        // Add flat overage fee for large parties
        if (formData.party_size > OVERAGE_THRESHOLD) {
            total += OVERAGE_FEE
        }
        
        // Add weekend surcharge if applicable
        if (formData.reservation_date) {
            // Parse date more reliably by splitting the string
            const [year, month, day] = formData.reservation_date.split('-').map(Number)
            const date = new Date(year, month - 1, day) // month is 0-indexed
            const dayOfWeek = date.getDay()
            if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
                total += WEEKEND_SURCHARGE
            }
        }
        
        return total
    }

    useEffect(() => {
        const reservation = reservations.find(r => r.id === parseInt(id))
        if (!reservation) {
            navigate("/")
        } else {
            setFormData({
                ...reservation,
                status: reservation.status || 'pending'
            })
        }
    }, [id, reservations, navigate])

    const onFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'party_size' ? parseInt(value) || 1 : value
        }))
    }

    async function onSubmit(e) {
        e.preventDefault()
        
        // Check if user is logged in
        if (!user) {
            showToast('You must be logged in to update a reservation', 'error')
            return
        }
        
        // Check if date is in the future
        const [year, month, day] = formData.reservation_date.split('-').map(Number)
        const selectedDate = new Date(year, month - 1, day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
            showToast('Reservation date must be in the future', 'error')
            return
        }
        
        // Check if all fields filled
        if (!formData.reservation_date || !formData.reservation_time) {
            showToast('Please fill in all required fields', 'error')
            return
        }

        // Show charge confirmation
        const totalCharge = calculateCharges()
        const hasOverage = formData.party_size > OVERAGE_THRESHOLD
        const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6
        
        const confirmed = window.confirm(
            `Updated reservation charges:\n\n` +
            `Party Size: ${formData.party_size} person(s) × $${CHARGE_PER_PERSON} = $${formData.party_size * CHARGE_PER_PERSON}\n` +
            `${hasOverage ? `Large Party Overage Fee: $${OVERAGE_FEE}\n` : ''}` +
            `${isWeekend ? `Weekend Surcharge: $${WEEKEND_SURCHARGE}\n` : ''}` +
            `Total: $${totalCharge}\n\n` +
            `Do you want to proceed with the update?`
        )
        
        if (!confirmed) {
            return
        }

        // rerender with updated data
        const updatedFormData = {
            ...formData,
            reservation_date: formData.reservation_date,
            reservation_time: formData.reservation_time,
            party_size: parseInt(formData.party_size),
            notes: formData.notes,
            status: formData.status
        }
        setFormData(updatedFormData)
        
        // Wait for API call
        const success = await updateReservation(formData)
        
        if (success) {
            showToast('Reservation updated successfully!', 'success')
            onClear()
            navigate('/')
        } else {
            showToast('Failed to update reservation', 'error')
        }
    }

    const onClear = () => {
        setFormData({
            reservation_date: '',
            reservation_time: '',
            party_size: 1,
            notes: '',
            status: 'pending'
        })
    }

    const onCancel = () => {
        navigate('/')
    }

    return (
        <>
            <h2>Editing Reservation {formData.id}</h2>
            
            {/* Display charges in the form */}
            <div style={{ 
                padding: '15px', 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #4a90e2',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <h3>Reservation Charges</h3>
                <p>Base charge: ${CHARGE_PER_PERSON} per person</p>
                <p>Large party fee: ${OVERAGE_FEE} flat fee (for parties over {OVERAGE_THRESHOLD})</p>
                <p>Weekend surcharge: ${WEEKEND_SURCHARGE} (Sat/Sun)</p>
                {formData.party_size > 0 && (
                    <div>
                        <p><strong>Estimated Total: ${calculateCharges()}</strong></p>
                        {formData.party_size > OVERAGE_THRESHOLD && (
                            <p style={{ color: '#d9534f', fontWeight: 'bold' }}>
                                ⚠️ Large party overage fee applies
                            </p>
                        )}
                    </div>
                )}
            </div>

            <form onSubmit={onSubmit}>
                <div>
                    <label>Date:<input 
                        type="date" 
                        name="reservation_date" 
                        onChange={onFormChange}
                        value={formData.reservation_date}
                        required />
                    </label>

                    <label>Time:<input 
                        type="time" 
                        name="reservation_time" 
                        onChange={onFormChange}
                        value={formData.reservation_time}
                        required />
                    </label>

                    <label>Party Size:<input 
                        type="number" 
                        name="party_size" 
                        onChange={onFormChange}
                        value={formData.party_size}
                        min="1"
                        required />
                    </label>

                    <label>Notes:
                    <textarea 
                        name="notes" 
                        rows="4"
                        onChange={onFormChange}
                        value={formData.notes}>
                    </textarea>
                    </label>
                    <label>Status:
                        <select 
                            name="status" 
                            onChange={onFormChange}
                            value={formData.status}
                            required>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <p>Current status: {formData.status}</p> 
                    </label>    
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit">Update Reservation</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default EditReservation