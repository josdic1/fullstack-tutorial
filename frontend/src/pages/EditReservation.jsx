import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"  
import AuthContext from "../contexts/AuthContext"
import ReservationContext from "../contexts/ReservationContext"

function EditReservation() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const { reservations, updateReservation } = useContext(ReservationContext)
    const { showToast } = useOutletContext()  // ✅ Get toast function
    
    const [formData, setFormData] = useState({
        reservation_date: '',
        reservation_time: '',
        party_size: 1,
        notes: '', 
        status: 'pending'  
    })
    
    const navigate = useNavigate()

useEffect(() => {
    const reservation = reservations.find(r => r.id === parseInt(id))
    if (!reservation) {
        navigate("/")
    } else {
        // ✅ Ensure status has a default value
        setFormData({
            ...reservation,
            status: reservation.status || 'pending'  // Fallback to 'pending'
        })
    }
}, [id, reservations, navigate])

const onFormChange = (e) => {
    const { name, value } = e.target
    console.log('🔄 Field changed:', name, '=', value)  // ✅ Debug
    setFormData(prev => ({
        ...prev,
        [name]: name === 'party_size' ? parseInt(value) || 1 : value
    }))
}

    async function onSubmit(e) {
        e.preventDefault()
        
        // Check if user is logged in
        if (!user) {
            showToast('You must be logged in to update a reservation', 'error')  // ✅ Toast instead of alert
            return
        }
        
        // Check if date is in the future
        const selectedDate = new Date(formData.reservation_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
            showToast('Reservation date must be in the future', 'error')  // ✅ Toast instead of alert
            return
        }
        
        // Check if all fields filled
        if (!formData.reservation_date || !formData.reservation_time) {
            showToast('Please fill in all required fields', 'error')  // ✅ Toast instead of alert
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
            showToast('Reservation updated successfully!', 'success')  // ✅ Toast instead of alert
            onClear()
            navigate('/')  // ✅ Changed from '/' to '/reservations'
        } else {
            showToast('Failed to update reservation', 'error')  // ✅ Toast instead of alert (also fixed message)
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
                <div>
                    <button type="submit">Update Reservation</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default EditReservation