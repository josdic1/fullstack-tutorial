from app.extensions import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

class MemberNote(db.Model, SerializerMixin):
    __tablename__ = 'member_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False, index=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservations.id'), nullable=False, index=True)
    note_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    member = db.relationship('Member', back_populates='notes')
    reservation = db.relationship('Reservation', back_populates='member_notes')
    
    serialize_rules = (
    '-member.notes',
    '-member.reservations',
    '-reservation.member_notes',
    '-reservation.member'
)
    
    def __repr__(self):
        return f'<MemberNote {self.id}>'
