# backend/seed.py
from faker import Faker
import random
from datetime import datetime, timedelta
from app import create_app
from app.extensions import db
from app.models import Member, Reservation, Rule, ReservationFee, MemberNote

fake = Faker()

# CONFIGURATION
NUMBER_OF_MEMBERS = 20
MIN_RESERVATIONS_PER_MEMBER = 1
MAX_RESERVATIONS_PER_MEMBER = 5

RESERVATION_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("Deleting old data...")
        MemberNote.query.delete()
        ReservationFee.query.delete()
        Reservation.query.delete()
        Rule.query.delete()
        Member.query.delete()
        
        print(f"Creating {NUMBER_OF_MEMBERS} members...")
        members = []
        for i in range(NUMBER_OF_MEMBERS):
            member = Member(
                username=fake.unique.user_name(),
                email=fake.unique.email(),
                full_name=fake.name(),
                phone=fake.phone_number(),
                role='member' if i < NUMBER_OF_MEMBERS - 2 else 'staff'  # Last 2 are staff
            )
            member.set_password('password123')
            members.append(member)
        
        db.session.add_all(members)
        db.session.commit()
        
        print("Creating rules...")
        rules = [
            Rule(
                rule_name='Large Party Fee',
                description='Fee for parties over 10 people',
                fee_amount=50.00,
                condition_type='party_size_limit',
                threshold_value=10,
                is_active=True
            ),
            Rule(
                rule_name='After Hours Fee',
                description='Fee for reservations after 9 PM',
                fee_amount=25.00,
                condition_type='after_hours',
                threshold_value=21,  # 9 PM in 24-hour
                is_active=True
            )
        ]
        db.session.add_all(rules)
        db.session.commit()
        
        print("Creating reservations...")
        reservations = []
        for member in members:
            num_reservations = random.randint(MIN_RESERVATIONS_PER_MEMBER, MAX_RESERVATIONS_PER_MEMBER)
            for _ in range(num_reservations):
                # Random date within next 60 days
                days_ahead = random.randint(1, 60)
                res_date = datetime.now().date() + timedelta(days=days_ahead)
                
                # Random time between 11 AM and 10 PM
                hour = random.randint(11, 22)
                res_time = datetime.strptime(f"{hour}:00", "%H:%M").time()
                
                party_size = random.randint(2, 15)
                
                reservation = Reservation(
                    member_id=member.id,
                    reservation_date=res_date,
                    reservation_time=res_time,
                    party_size=party_size,
                    notes=fake.sentence() if random.random() > 0.5 else None,
                    status=random.choice(RESERVATION_STATUSES)
                )
                reservations.append(reservation)
        
        db.session.add_all(reservations)
        db.session.flush()
        
        print("Applying fees...")
        fees = []
        for reservation in reservations:
            # Apply large party fee
            if reservation.party_size > 10:
                fee = ReservationFee(
                    reservation_id=reservation.id,
                    rule_id=rules[0].id,
                    fee_applied=50.00
                )
                fees.append(fee)
            
            # Apply after hours fee
            if reservation.reservation_time.hour >= 21:
                fee = ReservationFee(
                    reservation_id=reservation.id,
                    rule_id=rules[1].id,
                    fee_applied=25.00
                )
                fees.append(fee)
        
        db.session.add_all(fees)
        
        print("Creating member notes...")
        notes = []
        for reservation in reservations:
            if reservation.notes:
                note = MemberNote(
                    member_id=reservation.member_id,
                    reservation_id=reservation.id,
                    note_text=reservation.notes
                )
                notes.append(note)
        
        db.session.add_all(notes)
        db.session.commit()
        
        print(f"Seeding complete!")
        print(f"- {len(members)} members created")
        print(f"- {len(reservations)} reservations created")
        print(f"- {len(fees)} fees applied")
        print(f"- {len(notes)} notes created")
        print(f"\nTest login: username='any_username_from_above', password='password123'")

if __name__ == '__main__':
    seed_database()