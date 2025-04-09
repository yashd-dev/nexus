import os
from flask import Flask
from flask_cors import CORS
from supabase import create_client

from routes.auth import auth_bp
from routes.gemini import gemini_bp
from routes.gemini import setup_gemini
from routes.group import group_bp  
from routes.messeges import message_bp
from routes.semester import semester_bp
from routes.teacher import teacher_bp

def create_app():
    app = Flask(__name__)
    CORS(app)


    app.config["supabase_client"] = create_client("https://mhywwchxpfusatpoceps.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeXd3Y2h4cGZ1c2F0cG9jZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjU0MjIsImV4cCI6MjA1OTcwMTQyMn0.2bD79t7FEOIo-IuMqF0eHzIUU8a_48wPHxdiC4QFrpc") 
    app.config["gemini_model"] = setup_gemini()  
    app.secret_key = "ZxdGH4cMyAJRL2ee5kIPXjdOlMfBEpYtTzeNA10HtTUAWzW3G8j3JKktxfd3s9ELj7xQPRpNN/yk4gIUhrHY9w=="

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(gemini_bp, url_prefix="/api/gemini")
    app.register_blueprint(group_bp, url_prefix="/api/groups")  
    app.register_blueprint(message_bp, url_prefix="/api/messages") 
    app.register_blueprint(semester_bp, url_prefix="/api/semesters")
    app.register_blueprint(teacher_bp,url_prefix="/api/teachers")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
