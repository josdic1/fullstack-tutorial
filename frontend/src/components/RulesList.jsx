import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom'
import RulesCard from './RulesCard';
import RulesContext from '../contexts/RulesContext';

function RulesList() {

    const { rules } = useContext(RulesContext)


return (
<>
<h1>Rules List</h1>
<table>
    <thead>
    <tr>
        <th>RID</th>
        <th>Rule</th>
        <th>Description</th>
        <th>Fee Amt</th>
        <th>Condition</th>
        <th>Threshold</th>
        <th>Is Active</th>
        <th>Created</th>
        <th>Updated</th>
        
    </tr>
</thead>
    <tbody>
        {rules.map(r => 
            <RulesCard 
                key={r.id} 
                rule={r}
            />)}
    </tbody>
</table>
</>
)}

export default RulesList

