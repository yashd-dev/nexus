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

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")

        # Debugging prints
        print(f"Received Data: {data}")
        print(f"Email: {email}, Password: {password}")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Sign up user
        response = supabase.auth.sign_up({"email": email, "password": password})
        print("Supabase Auth Response:", response)

        if hasattr(response, "user") and response.user:
            user_data = {"username": username, "email": email , "password":password}
            db_response = supabase.table("users").insert(user_data).execute()
            print("Supabase DB Response:", db_response)

            return jsonify({"msg": f"Successfully signed up {username}"}), 201

        return jsonify({"error": "Signup failed"}), 400

    except Exception as e:
        print("Error:", str(e))  # Print detailed error in console
        return jsonify({"error": str(e)}), 500

    



if __name__ == "__main__":
    app.run(debug=True)