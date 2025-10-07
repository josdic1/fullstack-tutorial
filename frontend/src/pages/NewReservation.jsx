import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ReservationContext from '../contexts/ReservationContext'

function NewReservation() {
    const { user } = useContext(AuthContext)
    const { createReservation } = useContext(ReservationContext)

    const [formData, setFormData] = useState({
        reservation_date: '',
        reservation_time: '',
        party_size: 1,
        notes: '', 
        status: 'pending'  
    })
    
    const navigate = useNavigate()

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
            alert('You must be logged in to make a reservation')
            return
        }
        
        // Check if date is in the future
        const selectedDate = new Date(formData.reservation_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
            alert('Reservation date must be in the future')
            return
        }
        
        // Check if all fields filled
        if (!formData.reservation_date || !formData.reservation_time) {
            alert('Please fill in all required fields')
            return
        }
        
        // Wait for API call
        const success = await createReservation(formData)
        
        if (success) {
            onClear()
            navigate('/')
        } else {
            alert('Failed to create reservation')
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

    return (
        <>
            <h2>New Reservation Page</h2>
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
                </div>
                <div>
                    <button type="submit">Create Reservation</button>
                    <button type="button" onClick={onClear}>Clear Form</button>
                </div>
            </form>
        </>
    )
}

export default NewReservation