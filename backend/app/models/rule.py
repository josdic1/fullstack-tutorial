from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

# app/models.py - Update your Rule class

class Rule(db.Model, SerializerMixin):
    __tablename__ = 'rules'
    
    id = db.Column(db.Integer, primary_key=True)
    rule_name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    fee_amount = db.Column(db.Numeric(10, 2), nullable=False)
    fee_type = db.Column(db.String(20), default='flat')  # ← ADD THIS: 'flat' or 'per_person'
    condition_type = db.Column(db.String(50), nullable=False)
    threshold_value = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    reservation_fees = db.relationship('ReservationFee', back_populates='rule')
    
    serialize_rules = ('-reservation_fees.rule',)
    
    def to_dict(self, **kwargs):
        return {
            'id': self.id,
            'rule_name': self.rule_name,
            'description': self.description,
            'fee_amount': float(self.fee_amount),
            'fee_type': self.fee_type,  # ← ADD THIS
            'condition_type': self.condition_type,
            'threshold_value': self.threshold_value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }