from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Member, Rule
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

rules_bp = Blueprint('rules', __name__)

@rules_bp.route('', methods=['GET'])
@jwt_required()
def get_rules():
    """Get all rules (staff view)"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if member.role != 'staff':
        return jsonify({'error': 'Unauthorized: Staff role required'}), 403
    
    rules = Rule.query.order_by(Rule.id.asc()).all()  # ✅ Fixed

    return {
        'rules': [r.to_dict() for r in rules]  # ✅ Fixed
    }, 200


@rules_bp.route('/<int:rule_id>/is_active', methods=['PATCH'])
@jwt_required()
def update_rule_activation(rule_id):
    """Update rule activation status"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    # ✅ Check member exists
    if not member:
        return {'error': 'Member not found'}, 404
    
    # ✅ Only staff can modify rules
    if member.role != 'staff':
        return {'error': 'Unauthorized: Staff role required'}, 403
    
    # ✅ Get rule
    rule = Rule.query.get(rule_id)
    
    if not rule:
        return {'error': 'Rule not found'}, 404
    
    # ✅ Get data ONCE, after all the checks
    data = request.get_json()
    
    if not data:
        return {'error': 'No data provided'}, 400
    
    if 'is_active' in data:
        rule.is_active = data['is_active']
    
        db.session.commit()
        
        return {
            'message': 'Rule activation status updated', 
            'rule': rule.to_dict()
        }, 200
    
    return {'error': 'is_active field required'}, 400