from flask import Flask, request, jsonify
from supabase import create_client, Client
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
app.secret_key = os.environ.get("SECRET_KEY", "super_secret_key")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")  # Fixed this line
        
        # Debugging prints
        print(f"Received Data: {data}")
        print(f"Email: {email}, Password: {password}")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })


        if hasattr(response, "user") and response.user:
            user_query = supabase.table("users").select("*").eq("email", email).execute()
            user_data = user_query.data[0] if user_query.data else None

            if user_data:
                return jsonify({
                    "msg": "Login successful",
                    "user": {
                        "username": user_data.get("username"),
                        "email": user_data.get("email"),
                        "password":user_data.get("password")
                    },
                    
                }), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        print("Error:", str(e))  # Print detailed error in console
        return jsonify({"error": str(e)}), 500

        
if __name__ == '__main__':
    app.run(debug=True)