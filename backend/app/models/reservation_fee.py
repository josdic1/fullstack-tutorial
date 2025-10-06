from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

class ReservationFee(db.Model, SerializerMixin):
    __tablename__ = 'reservation_fees'
    
    id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id'), nullable=False, index=True)
    rule_id = db.Column(db.Integer, db.ForeignKey('rules.id'), nullable=False, index=True)
    fee_applied = db.Column(db.Numeric(10, 2), nullable=False)
    calculated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    reservation = db.relationship('Reservation', back_populates='fees')
    rule = db.relationship('Rule', back_populates='reservation_fees')
    
    serialize_rules = ('-reservation.fees', '-rule.reservation_fees')
    
    def __repr__(self):
        return f'<ReservationFee {self.id}>'
