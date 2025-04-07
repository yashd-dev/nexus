from flask import Flask, request, jsonify, session
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
        semester = data.get("semester", 1)  # Default to semester 1
        bio = data.get("bio", "")
        profile_pic = data.get("profile_pic", "")

        if not email or not password or not username:
            return jsonify({"error": "Email, username and password are required"}), 400

        # Check for existing email/username
        emails = supabase.table("users").select("email").execute()
        users = supabase.table("users").select("username").execute()
        user_list = [u["username"] for u in users.data]
        email_list = [user["email"] for user in emails.data]

        if email in email_list:
            return jsonify({"msg": f"{email} is already registered!"}), 500
        if username in user_list:
            return jsonify({"msg": f"{username} is already taken"}), 500

        # Sign up user via Supabase auth
        response = supabase.auth.sign_up({"email": email, "password": password})

        if hasattr(response, "user") and response.user:
            # Insert into users table
            user_data = {"username": username, "email": email, "password": password}
            supabase.table("users").insert(user_data).execute()

            # Insert into user_profiles table
            profile_data = {
                "username": username,
                "bio": bio,
                "profile_pic": profile_pic,
                "semester": semester
            }
            supabase.table("user_profiles").insert(profile_data).execute()

            # Set session
            session["username"] = username

            return jsonify({"msg": f"Successfully signed up {username}"}), 201

        return jsonify({"error": "Signup failed"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Authenticate using Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if hasattr(response, "user") and response.user:
            # Fetch user from 'users' table using email
            user_query = supabase.table("users").select("*").eq("email", email).execute()
            user_data = user_query.data[0] if user_query.data else None

            if user_data:
                username = user_data["username"]

                # Fetch profile info from 'user_profiles' using username
                profile_query = supabase.table("user_profiles").select("*").eq("username", username).execute()
                profile_data = profile_query.data[0] if profile_query.data else {}

                session.permanent = True
                session['username'] = username

                return jsonify({
                    "msg": "Login successful",
                    "user": {
                        "username": username,
                        "email": user_data.get("email"),
                        "bio": profile_data.get("bio", ""),
                        "profile_pic": profile_data.get("profile_pic", ""),
                        "semester": profile_data.get("semester", 1)
                    }
                }), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/peers', methods=['POST'])  # Use POST to get data from JSON body
def get_peers_by_semester():
    try:
        data = request.get_json()
        username = data.get("username")

        if not username:
            return jsonify({"error": "Username is required"}), 400

        # Fetch user's profile
        user_profile_response = supabase.table("user_profiles").select("semester").eq("username", username).execute()
        if not user_profile_response.data:
            return jsonify({"error": "User profile not found"}), 404

        current_semester = user_profile_response.data[0]["semester"]

        # Fetch peers in the same semester, excluding current user
        peers_response = supabase.table("user_profiles").select("username, bio, profile_pic").eq("semester", current_semester).neq("username", username).execute()

        return jsonify({
            "semester": current_semester,
            "peers": peers_response.data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/group_students', methods=['POST'])
def group_students():
    try:
        data = request.get_json()
        semester = data.get("semester")

        if not semester:
            return jsonify({"error": "Missing semester"}), 400

        # Get all users in that semester
        users_response = supabase.table("user_profiles").select("username").eq("semester", semester).execute()
        users = users_response.data

        if not users:
            return jsonify({"error": "No users found in that semester"}), 404

        # Group into chunks of 4–5
        from math import ceil
        import uuid

        grouped_users = [users[i:i + 5] for i in range(0, len(users), 5)]

        for group_number, group in enumerate(grouped_users, start=1):
            # Create study room
            room = supabase.table("study_rooms").insert({
                "semester": semester,
                "group_number": group_number
            }).execute()

            room_id = room.data[0]["id"]

            # Insert members into room_members
            for user in group:
                supabase.table("room_members").insert({
                    "room_id": room_id,
                    "username": user["username"]
                }).execute()

        return jsonify({"msg": f"{len(users)} users grouped into {len(grouped_users)} study rooms!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/my_room', methods=['POST'])
def get_my_study_room():
    try:
        data = request.get_json()
        username = data.get("username")

        if not username:
            return jsonify({"error": "Missing username"}), 400

        # Find the room the user is in
        member_response = supabase.table("room_members").select("room_id").eq("username", username).execute()
        if not member_response.data:
            return jsonify({"error": "You're not in any study room"}), 404

        room_id = member_response.data[0]["room_id"]

        # Get room details
        room = supabase.table("study_rooms").select("*").eq("id", room_id).execute().data[0]

        # Get all members
        members = supabase.table("room_members").select("username").eq("room_id", room_id).execute().data

        return jsonify({
            "room": room,
            "members": members
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)