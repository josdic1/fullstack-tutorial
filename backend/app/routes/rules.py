# app/routes/rules.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Member, Rule
from flask_jwt_extended import jwt_required, get_jwt_identity


rules_bp = Blueprint('rules', __name__)

@rules_bp.route('', methods=['GET'])
@jwt_required()
def get_rules():
    """Get all rules with optional filtering and sorting"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    # Get query parameters
    status_filter = request.args.get('status', 'all')
    sort_by = request.args.get('sort', 'rule_name')
    sort_order = request.args.get('order', 'asc')
    
    # Base query
    query = Rule.query
    
    # Apply status filter
    if status_filter == 'active':
        query = query.filter_by(is_active=True)
    elif status_filter == 'inactive':
        query = query.filter_by(is_active=False)
    
    # Apply sorting
    if sort_by == 'rule_name':
        sort_column = Rule.rule_name
    elif sort_by == 'fee_amount':
        sort_column = Rule.fee_amount
    else:
        sort_column = Rule.id
    
    if sort_order == 'desc':
        sort_column = sort_column.desc()
    
    query = query.order_by(sort_column)
    rules = query.all()
    
    # Manual serialization to avoid Decimal issues
    rules_data = []
    for rule in rules:
        rules_data.append({
            'id': rule.id,
            'rule_name': rule.rule_name,
            'description': rule.description,
            'fee_amount': float(rule.fee_amount),
            'condition_type': rule.condition_type,
            'threshold_value': rule.threshold_value,
            'is_active': rule.is_active
        })
    
    return jsonify(rules_data), 200

# GET single rule
@rules_bp.route('/<int:rule_id>', methods=['GET'])
@jwt_required()
def get_rule(rule_id):
    """Get a single rule by ID"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    rule = Rule.query.get_or_404(rule_id)
    return jsonify(rule.to_dict()), 200


# POST create new rule
@rules_bp.route('', methods=['POST'])
@jwt_required()
def create_rule():
    """Create a new rule"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    data = request.get_json()
    
    # Validation
    if not data.get('rule_name'):
        return {'error': 'rule_name is required'}, 400
    if not data.get('description'):
        return {'error': 'description is required'}, 400
    if 'fee_amount' not in data:
        return {'error': 'fee_amount is required'}, 400
    if not data.get('condition_type'):
        return {'error': 'condition_type is required'}, 400
    
    try:
        new_rule = Rule(
            rule_name=data['rule_name'],
            description=data['description'],
            fee_amount=float(data['fee_amount']),
            condition_type=data['condition_type'],
            threshold_value=data.get('threshold_value'),
            is_active=data.get('is_active', True)
        )
        db.session.add(new_rule)
        db.session.commit()
        
        return jsonify(new_rule.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# PATCH update rule
@rules_bp.route('/<int:rule_id>', methods=['PATCH'])
@jwt_required()
def update_rule(rule_id):
    """Update an existing rule"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    rule = Rule.query.get_or_404(rule_id)
    data = request.get_json()
    
    try:
        if 'rule_name' in data:
            rule.rule_name = data['rule_name']
        if 'description' in data:
            rule.description = data['description']
        if 'fee_amount' in data:
            rule.fee_amount = float(data['fee_amount'])
        if 'condition_type' in data:
            rule.condition_type = data['condition_type']
        if 'threshold_value' in data:
            rule.threshold_value = data['threshold_value']
        if 'is_active' in data:
            rule.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify(rule.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# PATCH toggle active status
@rules_bp.route('/<int:rule_id>/toggle', methods=['PATCH'])
@jwt_required()
def toggle_rule(rule_id):
    """Toggle rule active status"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    rule = Rule.query.get_or_404(rule_id)
    
    try:
        rule.is_active = not rule.is_active
        db.session.commit()
        
        return jsonify({
            'id': rule.id,
            'is_active': rule.is_active
        }), 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500


# DELETE rule
@rules_bp.route('/<int:rule_id>', methods=['DELETE'])
@jwt_required()
def delete_rule(rule_id):
    """Delete a rule"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    rule = Rule.query.get_or_404(rule_id)
    
    try:
        db.session.delete(rule)
        db.session.commit()
        return {'message': 'Rule deleted successfully'}, 200
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500