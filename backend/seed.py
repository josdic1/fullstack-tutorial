from datetime import datetime, timedelta
from app import create_app
from app.extensions import db
from app.models import Member, Reservation, Rule, ReservationFee, MemberNote

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("🗑️  Deleting old data...")
        MemberNote.query.delete()
        ReservationFee.query.delete()
        Reservation.query.delete()
        Rule.query.delete()
        Member.query.delete()
        
        # ✅ SIMPLE TEST USERS - No Faker BS
        print("👥 Creating test users...")
        
        josh = Member(
            username='josh',
            email='josh@test.com',
            full_name='Josh Dicker',
            phone='555-1001',
            role='member'
        )
        josh.set_password('pass')
        
        sarah = Member(
            username='sarah',
            email='sarah@test.com',
            full_name='Sarah Chen',
            phone='555-1002',
            role='member'
        )
        sarah.set_password('pass')
        
        mike = Member(
            username='mike',
            email='mike@test.com',
            full_name='Mike Rodriguez',
            phone='555-1003',
            role='member'
        )
        mike.set_password('pass')
        
        admin = Member(
            username='admin',
            email='admin@test.com',
            full_name='Admin Staff',
            phone='555-9999',
            role='staff'
        )
        admin.set_password('pass')
        
        db.session.add_all([josh, sarah, mike, admin])
        db.session.commit()
        
        print("📋 Creating rules...")
        large_party = Rule(
            rule_name='Large Party Fee',
            description='Fee for parties over 10 people',
            fee_amount=50.00,
            condition_type='party_size_limit',
            threshold_value=10,
            is_active=True
        )
        
        after_hours = Rule(
            rule_name='After Hours Fee',
            description='Fee for reservations after 9 PM',
            fee_amount=25.00,
            condition_type='after_hours',
            threshold_value=21,
            is_active=True
        )
        
        db.session.add_all([large_party, after_hours])
        db.session.commit()
        
        # ✅ SIMPLE RESERVATIONS - Easy to understand
        print("🍽️  Creating reservations...")
        
        today = datetime.now().date()
        
        # Josh's reservations
        josh_res1 = Reservation(
            member_id=josh.id,
            reservation_date=today + timedelta(days=1),
            reservation_time=datetime.strptime("18:00", "%H:%M").time(),
            party_size=4,
            notes='Birthday dinner',
            status='confirmed'
        )
        
        josh_res2 = Reservation(
            member_id=josh.id,
            reservation_date=today + timedelta(days=7),
            reservation_time=datetime.strptime("19:30", "%H:%M").time(),
            party_size=2,
            notes='Date night',
            status='pending'
        )
        
        josh_res3 = Reservation(
            member_id=josh.id,
            reservation_date=today + timedelta(days=14),
            reservation_time=datetime.strptime("21:00", "%H:%M").time(),
            party_size=12,
            notes='Company party',
            status='pending'
        )
        
        # Sarah's reservations
        sarah_res1 = Reservation(
            member_id=sarah.id,
            reservation_date=today + timedelta(days=2),
            reservation_time=datetime.strptime("12:00", "%H:%M").time(),
            party_size=3,
            notes='Lunch meeting',
            status='confirmed'
        )
        
        sarah_res2 = Reservation(
            member_id=sarah.id,
            reservation_date=today + timedelta(days=10),
            reservation_time=datetime.strptime("20:00", "%H:%M").time(),
            party_size=6,
            notes='Family dinner',
            status='pending'
        )
        
        # Mike's reservations
        mike_res1 = Reservation(
            member_id=mike.id,
            reservation_date=today + timedelta(days=3),
            reservation_time=datetime.strptime("17:00", "%H:%M").time(),
            party_size=8,
            notes='Team celebration',
            status='confirmed'
        )
        
        mike_res2 = Reservation(
            member_id=mike.id,
            reservation_date=today + timedelta(days=5),
            reservation_time=datetime.strptime("22:00", "%H:%M").time(),
            party_size=15,
            notes='Late night party',
            status='pending'
        )
        
        all_reservations = [josh_res1, josh_res2, josh_res3, sarah_res1, sarah_res2, mike_res1, mike_res2]
        db.session.add_all(all_reservations)
        db.session.flush()
        
        # Apply fees
        print("💰 Applying fees...")
        fees = []
        
        # Josh's large party gets fee
        fees.append(ReservationFee(
            reservation_id=josh_res3.id,
            rule_id=large_party.id,
            fee_applied=50.00
        ))
        
        # Josh's late reservation gets fee
        fees.append(ReservationFee(
            reservation_id=josh_res3.id,
            rule_id=after_hours.id,
            fee_applied=25.00
        ))
        
        # Mike's large party gets fee
        fees.append(ReservationFee(
            reservation_id=mike_res2.id,
            rule_id=large_party.id,
            fee_applied=50.00
        ))
        
        # Mike's late reservation gets fee
        fees.append(ReservationFee(
            reservation_id=mike_res2.id,
            rule_id=after_hours.id,
            fee_applied=25.00
        ))
        
        db.session.add_all(fees)
        
        # Create notes
        print("📝 Creating notes...")
        notes = []
        for res in all_reservations:
            if res.notes:
                note = MemberNote(
                    member_id=res.member_id,
                    reservation_id=res.id,
                    note_text=res.notes
                )
                notes.append(note)
        
        db.session.add_all(notes)
        db.session.commit()
        
        print(f"\n✅ Seeding complete!")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"👥 4 members created")
        print(f"🍽️  7 reservations created")
        print(f"💰 4 fees applied")
        print(f"📝 7 notes created")
        
        print(f"\n🔐 LOGIN CREDENTIALS (all use password: 'pass'):")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"josh   - Regular member (3 reservations)")
        print(f"sarah  - Regular member (2 reservations)")
        print(f"mike   - Regular member (2 reservations)")
        print(f"admin  - Staff (sees all reservations)")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

if __name__ == '__main__':
    seed_database()