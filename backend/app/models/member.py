from app.extensions import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone

class Member(db.Model, SerializerMixin):
    __tablename__ = 'members'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50))
    role = db.Column(db.String(50), default='member')
    is_active = db.Column(db.Boolean, default=True)
    member_since = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    reservations = db.relationship('Reservation', back_populates='member', cascade='all, delete-orphan')
    notes = db.relationship('MemberNote', back_populates='member', cascade='all, delete-orphan')
    
    # SerializerMixin configuration
    serialize_rules = (
        '-password_hash', # - stops loop back to member #
        '-reservations.member',  # - stops loop through fees #
        '-notes.member'  # - stops loop through notes #
                       )
     
    
    def set_password(self, password):
        """Hash and set the password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Verify password against hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<Member {self.username}>'