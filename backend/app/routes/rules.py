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