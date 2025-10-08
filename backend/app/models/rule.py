from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

class Rule(db.Model, SerializerMixin):
    __tablename__ = 'rules'
    
    id = db.Column(db.Integer, primary_key=True)
    rule_name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    fee_amount = db.Column(db.Numeric(10, 2), nullable=False)
    condition_type = db.Column(db.String(50), nullable=False)
    threshold_value = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))  # ✅ This line
    
    reservation_fees = db.relationship('ReservationFee', back_populates='rule')
    
    serialize_rules = ('-reservation_fees.rule',)