

function ReservationCard({reservation, onSelect, onUpdate,onDelete}) {



    const onClick = (e) => {
        const { name } = e.target
        switch(name) {
            case 'view':
                onSelect()
                break
            case 'update':
                onUpdate()
                break
            case 'delete':
                onDelete()
                break
            default:
                console.log('Unknown name:', name)
        }
    }

return (

<tr>
    <td>{reservation.member_id}</td>
    <td>{reservation.reservation_date}</td>
    <td>{reservation.reservation_time}</td>
    <td>{reservation.party_size}</td>
    <td>{reservation.notes}</td>
    <td>{reservation.status}</td>
    <td>{reservation.created_at}</td>
    <td>{reservation.updated_at}</td>
    <td>
        <button name='view' onClick={onClick}>View</button>
         <button id={reservation.id}  name='update' onClick={onClick}>Update</button>
        <button id={reservation.id} name='delete' onClick={onClick}>Delete</button>
    </td>
</tr>

)}

export default ReservationCard
