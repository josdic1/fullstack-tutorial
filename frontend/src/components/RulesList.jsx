// src/components/RulesList.jsx
import { useEffect, useState } from 'react';
import { useRules } from '../hooks/useRules';
import RuleForm from './RuleForm';
import './RulesList.css';

const RulesList = () => {
  const { rules, loading, error, fetchRules, toggleRule, deleteRule } = useRules();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rule_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Fetch rules on mount and when filters change
  useEffect(() => {
    fetchRules({
      status: statusFilter,
      sort: sortBy,
      order: sortOrder
    });
  }, [statusFilter, sortBy, sortOrder]);

  const handleToggle = async (ruleId) => {
    try {
      await toggleRule(ruleId);
    } catch (err) {
      alert('Failed to toggle rule');
    }
  };

  const handleDelete = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        await deleteRule(ruleId);
      } catch (err) {
        alert('Failed to delete rule');
      }
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="rules-container">
      <div className="rules-header">
        <h1>Fee Rules Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add New Rule
        </button>
      </div>

      {/* Filters and Sorting */}
      <div className="rules-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <button 
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => setStatusFilter('all')}
          >
            Show All
          </button>
          <button 
            className={statusFilter === 'active' ? 'active' : ''}
            onClick={() => setStatusFilter('active')}
          >
            Active Only
          </button>
          <button 
            className={statusFilter === 'inactive' ? 'active' : ''}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive Only
          </button>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rule_name">Name</option>
            <option value="fee_applied">Fee Amount</option>
            <option value="id">ID</option>
          </select>
          <button onClick={toggleSortOrder} className="sort-toggle">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && <div className="loading">Loading rules...</div>}
      {error && <div className="error">{error}</div>}

      {/* Rules Table */}
      {!loading && (
        <table className="rules-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Rule Name</th>
              <th>Description</th>
              <th>Fee Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No rules found. Create your first rule!
                </td>
              </tr>
            ) : (
              rules.map(rule => (
                <tr key={rule.id} className={!rule.is_active ? 'inactive-row' : ''}>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={rule.is_active}
                        onChange={() => handleToggle(rule.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td className="rule-name">{rule.rule_name}</td>
                  <td className="rule-description">{rule.description}</td>
                  <td className="fee-amount">${parseFloat(rule.fee_amount).toFixed(2)}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(rule)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(rule.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <RuleForm 
              rule={editingRule} 
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesList;