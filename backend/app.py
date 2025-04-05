from flask import Flask, request, jsonify, redirect, session
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

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Sign up user
        response = supabase.auth.sign_up({"email": email, "password": password})    

        emails = supabase.table("users").select("email").execute()
        users = supabase.table("users").select("username").execute()
        user_list = [u["username"] for u in users.data]
        email_list = [user["email"] for user in emails.data]
        if email in email_list:
            return jsonify({"msg" : f"{email} is already registered!"}),500
        if username in user_list:
            return jsonify({"msg":f"{username} is already taken"}),500

        if hasattr(response, "user") and response.user:
            user_data = {"username": username, "email": email , "password":password}
            db_response = supabase.table("users").insert(user_data).execute()

            session["username"] = username

            return jsonify({"msg": f"Successfully signed up {username}"}), 201

        return jsonify({"error": "Signup failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/signup/github' , methods=['GET'])
def signup_with_github():
    try:
        redirect_url = "http://localhost:5000/api/signup/github/callback"

        auth_url = supabase.auth.sign_in_with_oauth({
            "provider": "github",
            "options": {
                "redirectTo": redirect_url
                }
            })

        return redirect(auth_url.url)
    
    except Exception as e:
        return jsonify({"error": str(e)}),500


@app.route('/api/login/github' , methods=['GET'])
def login_with_github():
    try:
        redirect_url = "http://localhost:5000/api/login/github/callback"

        auth_url = supabase.auth.sign_in_with_oauth({
            "provider": "github",
            "options": {
                "redirectTo": redirect_url
                }
            })

        return redirect(auth_url.url)
    
    except Exception as e:
        return jsonify({"error": str(e)}),500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")  # Fixed this line
        
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
                session.permanent = True
                session['username'] = user_data["username"]
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
        return jsonify({"error": str(e)}), 500

@app.route('/api/message' , methods=['POST'])
def message():
    try:
        sender = session.get("username")
        data = request.get_json()
        receiver = data.get("receiver")
        message = data.get("message")
        print(sender)
        print(receiver)
        print(message)
        if not sender or not receiver or not message:
            return jsonify({"msg":"required fields are missing"}),500
        response = supabase.table("messages").insert({"sender":sender , "receiver":receiver , "message":message}).execute()
        return jsonify({"msg":f"{message} inserted"})
    except Exception as e:
        return jsonify({"error":str(e)}) , 500


if __name__ == "__main__":
    app.run(debug=True)