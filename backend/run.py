from app import create_app

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Run development server
    # Note: In production, gunicorn will import 'app' directly
    app.run(host='0.0.0.0', port=5555, debug=True)