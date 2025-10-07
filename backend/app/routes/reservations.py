from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Member, Reservation, Rule, ReservationFee, MemberNote
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('', methods=['POST'])
@jwt_required()
def create_reservation():
    """Create a new reservation"""
    member_id = int(get_jwt_identity())
    data = request.get_json()
    
    required_fields = ['reservation_date', 'reservation_time', 'party_size']
    if not all(field in data for field in required_fields):
        return {'error': 'Missing required fields'}, 400
    
    try:
        res_date = datetime.strptime(data['reservation_date'], '%Y-%m-%d').date()
        res_time = datetime.strptime(data['reservation_time'], '%H:%M').time()
    except ValueError:
        return {'error': 'Invalid date or time format'}, 400
    
    reservation = Reservation(
        member_id=member_id,
        reservation_date=res_date,
        reservation_time=res_time,
        party_size=data['party_size'],
        notes=data.get('notes'),
        status='pending'
    )
    
    db.session.add(reservation)
    db.session.flush()
    
    active_rules = Rule.query.filter_by(is_active=True).all()
    
    for rule in active_rules:
        fee_applies = False
        
        if rule.condition_type == 'party_size_limit' and data['party_size'] > rule.threshold_value:
            fee_applies = True
        
        if fee_applies:
            fee = ReservationFee(
                reservation_id=reservation.id,
                rule_id=rule.id,
                fee_applied=rule.fee_amount
            )
            db.session.add(fee)
    
    if data.get('notes'):
        note = MemberNote(
            member_id=member_id,
            reservation_id=reservation.id,
            note_text=data['notes']
        )
        db.session.add(note)
    
    db.session.commit()
    
    # Manual serialization to avoid recursion
    return {
        'message': 'Reservation created successfully',
        'reservation': reservation.to_dict(rules=('-member', '-fees', '-member_notes')),
        'total_fees': float(reservation.calculate_total_fees())
    }, 201

@reservations_bp.route('', methods=['GET'])
@jwt_required()
def get_reservations():
    """Get all reservations (staff view) or user's own reservations"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    if member.role == 'staff':
        reservations = Reservation.query.order_by(Reservation.reservation_date.desc()).all()
    else:
        reservations = Reservation.query.filter_by(member_id=member_id).order_by(Reservation.reservation_date.desc()).all()
    
    return {
        'reservations': [r.to_dict(rules=('-member', '-fees', '-member_notes')) for r in reservations]
    }, 200

# @reservations_bp.route('/<int:reservation_id>', methods=['GET'])
# @jwt_required()
# def get_reservation(reservation_id):
#     """Get a specific reservation"""
#     member_id = int(get_jwt_identity())
#     reservation = Reservation.query.get(reservation_id)
    
#     if not reservation:
#         return {'error': 'Reservation not found'}, 404
    
#     member = Member.query.get(member_id)
#     if reservation.member_id != member_id and member.role != 'staff':
#         return {'error': 'Unauthorized'}, 403
    
#     return reservation.to_dict(rules=('-member.reservations', '-fees.reservation', '-member_notes.reservation')), 200

@reservations_bp.route('/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def delete_reservation(reservation_id):
    """Delete a reservation"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    
    reservation = Reservation.query.get(reservation_id)
    
    if not reservation:
        return {'error': 'Reservation not found'}, 404
    
    if reservation.member_id != member_id and member.role != 'staff':
        return {'error': 'Unauthorized'}, 403
    
    db.session.delete(reservation)
    db.session.commit()
    
    return {'message': 'Reservation deleted'}, 200

@reservations_bp.route('/<int:reservation_id>', methods=['PATCH'])
@jwt_required()
def update_reservation(reservation_id):
    """Update reservation details"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    data = request.get_json()
    
    reservation = Reservation.query.get(reservation_id)
    
    if not reservation:
        return {'error': 'Reservation not found'}, 404
    
    if reservation.member_id != member_id and member.role != 'staff':
        return {'error': 'Unauthorized'}, 403
    
    if 'reservation_date' in data:
        try:
            reservation.reservation_date = datetime.strptime(data['reservation_date'], '%Y-%m-%d').date()
        except ValueError:
            return {'error': 'Invalid date format'}, 400
    
    if 'reservation_time' in data:
        try:
            reservation.reservation_time = datetime.strptime(data['reservation_time'], '%H:%M').time()
        except ValueError:
            return {'error': 'Invalid time format'}, 400
    
    if 'party_size' in data:
        reservation.party_size = data['party_size']
    
    if 'notes' in data:
        reservation.notes = data['notes']
        note = MemberNote(
            member_id=member_id,
            reservation_id=reservation.id,
            note_text=data['notes']
        )
        db.session.add(note)

    if 'status' in data:
        reservation.status = data['status']
    
    db.session.commit()
    
    return {
        'message': 'Reservation updated', 
        'reservation': reservation.to_dict(rules=('-member', '-fees', '-member_notes'))
    }, 200

@reservations_bp.route('/<int:reservation_id>/status', methods=['PATCH'])
@jwt_required()
def update_reservation_status(reservation_id):
    """Update reservation status"""
    member_id = int(get_jwt_identity())
    member = Member.query.get(member_id)
    data = request.get_json()
    
    reservation = Reservation.query.get(reservation_id)
    
    if not reservation:
        return {'error': 'Reservation not found'}, 404
    
    if reservation.member_id != member_id and member.role != 'staff':
        return {'error': 'Unauthorized'}, 403
    
    if 'status' in data:
        reservation.status = data['status']
        db.session.commit()
    
    return {
        'message': 'Status updated', 
        'reservation': reservation.to_dict(rules=('-member', '-fees', '-member_notes'))
    }, 200
