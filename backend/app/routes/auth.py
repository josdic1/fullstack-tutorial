from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Member
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new member"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password', 'full_name']
    if not all(field in data for field in required_fields):
        return {'error': 'Missing required fields'}, 400
    
    # Check if username or email already exists
    if Member.query.filter_by(username=data['username']).first():
        return {'error': 'Username already exists'}, 400
    
    if Member.query.filter_by(email=data['email']).first():
        return {'error': 'Email already exists'}, 400
    
    # Create new member
    member = Member(
        username=data['username'],
        email=data['email'],
        full_name=data['full_name'],
        phone=data.get('phone')
    )
    member.set_password(data['password'])
    
    db.session.add(member)
    db.session.commit()
    
    return {'message': 'Member registered successfully', 'member': member.to_dict()}, 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login and get JWT token"""
    data = request.get_json()
    
    if not data.get('username') or not data.get('password'):
        return {'error': 'Username and password required'}, 400
    
    member = Member.query.filter_by(username=data['username']).first()
    
    if not member or not member.check_password(data['password']):
        return {'error': 'Invalid credentials'}, 401
    
    if not member.is_active:
        return {'error': 'Account is inactive'}, 403
    
    # Create JWT token
    access_token = create_access_token(identity=str(member.id))
    
    return {
        'access_token': access_token,
        'member': member.to_dict()
    }, 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_member():
    """Get current logged-in member"""
    member_id = get_jwt_identity()
    member = Member.query.get(member_id)
    
    if not member:
        return {'error': 'Member not found'}, 404
    
    return member.to_dict(), 200
