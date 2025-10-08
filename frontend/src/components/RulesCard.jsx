


function RulesCard({ rule }) {



    // const onClick = (e) => {
    //     const { name } = e.target
    //     switch(name) {
    //         case 'update':
    //             onUpdate()
    //             break
    //         case 'delete':
    //             onDelete()
    //             break;
    //         default:
    //         break
    // }}

return (
<>
<tr>
    <td>{rule.id}</td>
    <td>{rule.rule_name}</td>
    <td>{rule.description}</td>
    <td>{rule.fee_amount}</td>
    <td>{rule.condition_type}</td>
    <td>{rule.threshold_value}</td>
    <td>{rule.is_active ? "YES" : "no"}</td>
    <td>{rule.created_at}</td>
    <td>{rule.updated_at}</td>
     <td>
                <div style={{ display: 'flex', gap: '5px' }}>  {/* ✅ Add wrapper */}
           
                </div>
            </td>
    
</tr>

</>
)}

export default RulesCard

  