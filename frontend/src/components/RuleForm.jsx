// src/components/RuleForm.jsx
import { useState, useEffect } from 'react';
import { useRules } from '../hooks/useRules';
import './RuleForm.css';

const RuleForm = ({ rule, onClose }) => {
  const { createRule, updateRule } = useRules();
  
  const [formData, setFormData] = useState({
    rule_name: '',
    description: '',
    fee_amount: '',
    fee_type: 'flat',  // ← ADD THIS
    condition_type: 'party_size',
    threshold_value: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (rule) {
      setFormData({
        rule_name: rule.rule_name,
        description: rule.description,
        fee_amount: rule.fee_amount,
        fee_type: rule.fee_type || 'flat',  // ← ADD THIS
        condition_type: rule.condition_type,
        threshold_value: rule.threshold_value || '',
        is_active: rule.is_active
      });
    }
  }, [rule]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.rule_name.trim()) {
      newErrors.rule_name = 'Rule name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.fee_amount || parseFloat(formData.fee_amount) < 0) {
      newErrors.fee_amount = 'Fee must be a positive number';
    }

    if (!formData.condition_type) {
      newErrors.condition_type = 'Condition type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSubmitting(true);
    
    try {
      const ruleData = {
        rule_name: formData.rule_name,
        description: formData.description,
        fee_amount: parseFloat(formData.fee_amount),
        fee_type: formData.fee_type,  // ← ADD THIS
        condition_type: formData.condition_type,
        threshold_value: formData.threshold_value ? parseInt(formData.threshold_value) : null,
        is_active: formData.is_active
      };
      
      if (rule) {
        // Update existing rule
        await updateRule(rule.id, ruleData);
      } else {
        // Create new rule
        await createRule(ruleData);
      }
      
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rule-form">
      <div className="form-header">
        <h2>{rule ? 'Edit Rule' : 'Create New Rule'}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rule_name">Rule Name *</label>
          <input
            type="text"
            id="rule_name"
            name="rule_name"
            value={formData.rule_name}
            onChange={handleChange}
            placeholder="e.g., Large Party Fee"
            className={errors.rule_name ? 'error' : ''}
          />
          {errors.rule_name && <span className="error-msg">{errors.rule_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe when this fee applies..."
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-msg">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fee_amount">Fee Amount ($) *</label>
            <input
              type="number"
              id="fee_amount"
              name="fee_amount"
              value={formData.fee_amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.fee_amount ? 'error' : ''}
            />
            {errors.fee_amount && <span className="error-msg">{errors.fee_amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fee_type">Fee Type *</label>
            <select
              id="fee_type"
              name="fee_type"
              value={formData.fee_type}
              onChange={handleChange}
            >
              <option value="flat">Flat Fee</option>
              <option value="per_person">Per Person</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="threshold_value">Threshold Value</label>
            <input
              type="number"
              id="threshold_value"
              name="threshold_value"
              value={formData.threshold_value}
              onChange={handleChange}
              placeholder="e.g., 20"
              min="0"
            />
            <span className="help-text">Optional - used for party size, booking days, etc.</span>
          </div>

          <div className="form-group">
            <label htmlFor="condition_type">Condition Type *</label>
            <select
              id="condition_type"
              name="condition_type"
              value={formData.condition_type}
              onChange={handleChange}
              className={errors.condition_type ? 'error' : ''}
            >
              <option value="party_size">Party Size</option>
              <option value="booking_days">Booking Days in Advance</option>
              <option value="after_hours">After Hours</option>
              <option value="weekend">Weekend</option>
              <option value="holiday">Holiday</option>
              <option value="custom">Custom</option>
            </select>
            {errors.condition_type && <span className="error-msg">{errors.condition_type}</span>}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <span>Active (rule will be applied to reservations)</span>
          </label>
        </div>

        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (rule ? 'Update Rule' : 'Create Rule')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RuleForm;