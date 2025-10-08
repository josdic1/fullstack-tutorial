function ReservationCard({reservation, onSelect, onUpdate, onDelete}) {
    
    const totalFees = reservation.fees?.reduce((sum, fee) => sum + parseFloat(fee.fee_applied), 0) || 0
    
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
            <td style={{ textTransform: 'capitalize' }}>
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: reservation.status === 'confirmed' ? '#d4edda' : 
                               reservation.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                    fontSize: '12px'
                }}>
                    {reservation.status}
                </span>
            </td>
            <td>
                {totalFees > 0 ? (
                    <span style={{ fontWeight: 'bold', color: '#dc3545' }}>
                        ${totalFees.toFixed(2)}
                    </span>
                ) : (
                    <span style={{ color: '#28a745' }}>$0.00</span>
                )}
            </td>
            <td>{reservation.created_at}</td>
            <td>{reservation.updated_at}</td>
            <td>
                <div style={{ display: 'flex', gap: '5px' }}>  {/* ✅ Add wrapper */}
                    <button name='view' onClick={onClick}>View</button>
                    <button name='update' onClick={onClick}>Update</button>
                    <button name='delete' onClick={onClick}>Delete</button>
                </div>
            </td>
        </tr>
    )
}

export default ReservationCard