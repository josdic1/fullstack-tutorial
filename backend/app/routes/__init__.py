from flask import Flask
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

def create_app(config_name='development'):
    """
    Application factory pattern
    Creates and configures the Flask app
    """
    app = Flask(__name__)

    # Load configuration
    from app.config import config
    app.config.from_object(config[config_name])

    # Initialize extensions
    from app.extensions import db, migrate, bcrypt, jwt, cors

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Import models AFTER db.init_app so they're registered
    from app.models.member import Member  # Changed from User to Member

    # Register blueprints (API routes)
    # We'll add these after creating our routes
    # from app.routes.auth import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Health check route
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Backend is running'}, 200

    return app