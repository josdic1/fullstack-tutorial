import { useState, useEffect, useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import RulesContext from "../contexts/RulesContext"

function RulesProvider({children}) {
    const { token, user } = useContext(AuthContext)  // ✅ Only declare once
    const [rules, setRules] = useState([])
    const [error, setError] = useState(null)

    const fetchRules = async () => {
        if (!token || !user) {
            console.log('Skipping fetch - no token or user yet')
            return
        }
        
        try {
            const response = await fetch('http://localhost:5555/api/rules', {
                headers: { "Authorization": `Bearer ${token}` }
            })
            
            if (response.ok) {
                const data = await response.json()
                setRules(data.rules)
                setError(null)
            }
        } catch (error) {
            console.error('Error:', error)
            setError('Cannot connect to server')
        }
    }

    useEffect(() => {
        fetchRules()
    }, [token, user])

    const createRule = async (rulesData) => {
  
        try {
            const response = await fetch('http://localhost:5555/api/rules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(rulesData)
            })
            
            if (response.ok) {
                const { rule } = await response.json()
                setRules(prev => [...prev, rule])
                return true
            }
            return false
        } catch (error) {
            console.error('Error creating rule:', error)
            return false
        }
    }

    const updateRule = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:5555/api/rules/${updatedData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            })
            
            if (response.ok) {
                const { rule } = await response.json()
                setRules(prev => prev.map(r => r.id === updatedData.id ? rule : r))
                return true
            }
            
            console.error('Update failed:', response.status)
            return false
            
        } catch (error) {
            console.error('Error updating rule:', error)
            return false
        }
    }

    const toggleRuleActive = async (ruleId, currentStatus) => {
    try {
        const response = await fetch(`http://localhost:5555/api/rules/${ruleId}/is_active`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ is_active: !currentStatus })
        })
        
        if (response.ok) {
            const { rule } = await response.json()
            setRules(prev => prev.map(r => r.id === ruleId ? rule : r))
            return true
        }
        return false
    } catch (error) {
        console.error('Error toggling rule:', error)
        return false
    }
}

    const deleteRule = async (id) => {
        try {
            const response = await fetch(`http://localhost:5555/api/rules/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                setRules(prev => prev.filter(r => r.id !== id))
                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting rule:', error)
            return false
        }
    }

    return (
        <RulesContext.Provider 
            value={{ rules, error, fetchRules, createRule, updateRule, deleteRule }}>
            {children}
        </RulesContext.Provider>
    )
}

export default RulesProvider