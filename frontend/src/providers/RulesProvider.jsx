import { useState, useEffect, useContext } from "react"
import AuthContext from "../contexts/AuthContext"
import RulesContext from "../contexts/RulesContext"

function RulesProvider({ children }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5555/api';
  
  // Helper to get auth headers with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');  // ← Change from 'access_token' to 'token'
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
  // Fetch rules with filters and sorting
  const fetchRules = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.order) params.append('order', filters.order);

      const response = await fetch(`${API_URL}/rules?${params}`, {
        headers: getAuthHeaders()  // ← ADD THIS
      });
      if (!response.ok) throw new Error('Failed to fetch rules');
      
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create rule
  const createRule = async (ruleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/rules`, {
        method: 'POST',
        headers: getAuthHeaders(),  // ← CHANGE THIS
        body: JSON.stringify(ruleData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create rule');
      }
      
      const newRule = await response.json();
      setRules(prev => [...prev, newRule]);
      return newRule;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update rule
  const updateRule = async (ruleId, ruleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/rules/${ruleId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),  // ← CHANGE THIS
        body: JSON.stringify(ruleData)
      });
      
      if (!response.ok) throw new Error('Failed to update rule');
      
      const updatedRule = await response.json();
      setRules(prev => prev.map(r => r.id === ruleId ? updatedRule : r));
      return updatedRule;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle rule active status
  const toggleRule = async (ruleId) => {
    try {
      const response = await fetch(`${API_URL}/rules/${ruleId}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders()  // ← ADD THIS
      });
      
      if (!response.ok) throw new Error('Failed to toggle rule');
      
      const updatedRule = await response.json();
      setRules(prev => prev.map(r => 
        r.id === ruleId ? { ...r, is_active: updatedRule.is_active } : r
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete rule
  const deleteRule = async (ruleId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/rules/${ruleId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()  // ← ADD THIS
      });
      
      if (!response.ok) throw new Error('Failed to delete rule');
      
      setRules(prev => prev.filter(r => r.id !== ruleId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    rules,
    loading,
    error,
    fetchRules,
    createRule,
    updateRule,
    toggleRule,
    deleteRule
  };

  return (
    <RulesContext.Provider value={value}>
      {children}
    </RulesContext.Provider>
  );
};

export default RulesProvider