import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ReservationContext from '../contexts/ReservationContext'

function NewReservation() {
    const { user } = useContext(AuthContext)
    const { createReservation } = useContext(ReservationContext)

    const [banner, setBanner] = useState({ show: false, message: '', type: '' })
    const [formData, setFormData] = useState({
        reservation_date: '',
        reservation_time: '',
        party_size: 1,
        notes: ''
    })

    const navigate = useNavigate()

    const showBanner = (message, type = 'success') => {
    setBanner({ show: true, message, type })
    
    setTimeout(() => {
        setBanner({ show: false, message: '', type: '' })
    }, 5000) // 5 seconds
}

    const onFormChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    function onSubmit(e) {
    e.preventDefault()
    
    // Check if user is logged in
    if (!user) {
        showBanner('You must be logged in to make a reservation', 'error')
        return
    }
    
    // Check if date is in the future
    const selectedDate = new Date(formData.reservation_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to compare just dates
    
    if (selectedDate < today) {
        showBanner('Reservation date must be in the future', 'error')
        return
    }
    
    // Check if all fields filled
    if (!formData.reservation_date || !formData.reservation_time) {
        showBanner('Please fill in all required fields', 'error')
        return
    }
    
    // All good - proceed with API call (later)
    showBanner('Reservation created successfully!', 'success')

    // send to API
    createReservation(formData)
    navigate('/')
    // Reset form
    onClear()
}

const onClear = () => {
    setFormData({
        reservation_date: '',
        reservation_time: '',
        party_size: 1,
        notes: ''
    })
}


return (
<>
    <h2>New Reservation Page</h2>
        {banner.show && (
        <div className={`banner ${banner.type}`}>
            {banner.message}
        </div>
    )}
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
)}



export default NewReservation

