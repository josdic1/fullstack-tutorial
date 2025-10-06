from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

class Reservation(db.Model, SerializerMixin):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False, index=True)
    reservation_date = db.Column(db.Date, nullable=False, index=True)
    reservation_time = db.Column(db.Time, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending', index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    member = db.relationship('Member', back_populates='reservations')
    fees = db.relationship('ReservationFee', back_populates='reservation', cascade='all, delete-orphan')
    member_notes = db.relationship('MemberNote', back_populates='reservation', cascade='all, delete-orphan')
    
    serialize_rules = ('-member.reservations', '-fees.reservation', '-member_notes.reservation')
    
    def calculate_total_fees(self):
        return sum(fee.fee_applied for fee in self.fees)
    
    def __repr__(self):
        return f'<Reservation {self.id}>'