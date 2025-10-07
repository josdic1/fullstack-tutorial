import { useContext } from 'react'
import ReservationContext from '../contexts/ReservationContext'
import ReservationList from '../components/ReservationList'

function ReservationsPage() {
    const { reservations } = useContext(ReservationContext)
    
    return (
        <>
            <h2>All Reservations</h2>
            <ReservationList reservations={reservations} />
        </>
    )
}

export default ReservationsPage