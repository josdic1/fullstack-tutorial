# app/routes/__init__.py
# This file can be empty or have imports

# Empty is fine:
pass

# Or import your blueprints for convenience:
from app.routes.auth import auth_bp
from app.routes.reservations import reservations_bp