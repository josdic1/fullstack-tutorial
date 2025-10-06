from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

def create_app(config_name='development'):
    """
    Application factory pattern
    Creates and configures the Flask app
    """
    app = Flask(__name__)

    from app.config import config
    app.config.from_object(config[config_name])

    from app.extensions import db, migrate, bcrypt, jwt, cors
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Import all models
    from app.models import Member, Reservation, Rule, ReservationFee, MemberNote

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.reservations import reservations_bp


    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(reservations_bp, url_prefix='/api/reservations')


    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Backend is running'}, 200

    return app