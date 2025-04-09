from flask import Blueprint, request, jsonify, current_app
import uuid
import bcrypt
import re

auth_bp = Blueprint("auth", __name__)

SALT_ROUNDS = 12


def validate_email(email):

    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def validate_password(password):

    pattern = r"^(?=.*[!@#$%^&*()])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    return re.match(pattern, password) is not None


@auth_bp.route("/signup", methods=["POST"])
def signup():
    supabase = current_app.config["supabase_client"]

    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")  
        semester = data.get("semester")
        roll_number = data.get("roll_number")
        department = data.get("department")
        is_available = data.get("is_available")

        if not name or not email or not password or not role:
            return (
                jsonify(
                    {
                        "message": "Name, email, password, and role are required",
                        "errors": [
                            {"field": "name", "message": "Name is required"},
                            {"field": "email", "message": "Email is required"},
                            {"field": "password", "message": "Password is required"},
                            {"field": "role", "message": "Role is required"},
                        ],
                    }
                ),
                400,
            )

        if role not in ("student", "teacher"):
            return (
                jsonify(
                    {
                        "message": "Invalid role. Must be 'student' or 'teacher'",
                        "errors": [
                            {
                                "field": "role",
                                "message": "Role must be 'student' or 'teacher'",
                            }
                        ],
                    }
                ),
                400,
            )

        if not validate_email(email):
            return (
                jsonify(
                    {
                        "message": "Invalid email format",
                        "errors": [{"field": "email", "message": "Invalid email format"}],
                    }
                ),
                400,
            )

        if not validate_password(password):
            return (
                jsonify(
                    {
                        "message": "Invalid password format",
                        "errors": [
                            {
                                "field": "password",
                                "message": "The password must contain 8 letters, with 1 symbol, 1 lower case character, 1 upper case character, and 1 number",
                            }
                        ],
                    }
                ),
                400,
            )

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(SALT_ROUNDS)).decode("utf-8")

        users_result = supabase.table("users").select("email").eq("email", email).execute()

        if users_result.data:
            return (
                jsonify(
                    {
                        "message": f"{email} is already registered!",
                        "errors": [
                            {"field": "email", "message": "Email already registered"}
                        ],
                    }
                ),
                409,
            )  


        user_id = str(uuid.uuid4())  
        user_data = {
            "id": user_id,
            "name": name,
            "email": email,
            "password_hash": hashed_password,
            "role": role,
        }
        try:
             supabase.table("users").insert(user_data).execute()
        except Exception as e:

             return (
                jsonify(
                    {
                        "message": "Failed to create user",
                        "errors": [str(e)],
                    }
                ),
                500,
            )


        if role == "student":
            if semester is None:
                return (
                    jsonify(
                        {
                            "message": "Semester is required for students",
                            "errors": [
                                {"field": "semester", "message": "Semester is required"}
                            ],
                        }
                    ),
                    400,
                )
            student_data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
            }
            table_name = "students"
            insert_data = student_data
        elif role == "teacher":
            teacher_data = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "is_available": is_available,
            }
            table_name = "teachers"
            insert_data = teacher_data


        try:
           supabase.table(table_name).insert(insert_data).execute()
        except Exception as e:
            try:
                supabase.table("users").delete().eq("id", user_id).execute()
            except Exception as rollback_error:
                print(f"Rollback failed: {rollback_error}")
            return (
                jsonify(
                    {
                        "message": f"Failed to create {role}",
                        "errors": [str(e)],
                    }
                ),
                500,
            )

        return jsonify({"message": f"Successfully signed up as {role}", 
                        "user": {
                            "id": user_id,
                            "name": name,
                            "email": email,
                            "role": role,
                            "created_at": "now()",
                            "updated_at": "now()"
                        }                    
                        }), 201  

    except Exception as e:
        return (
            jsonify({"message": "Internal server error", "errors": [str(e)]}),
            500,
        )



@auth_bp.route("/login", methods=["POST"])
def login():
    supabase = current_app.config["supabase_client"]
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return (
                jsonify(
                    {
                        "message": "Email and password are required",
                        "errors": [
                            {"field": "email", "message": "Email is required"},
                            {"field": "password", "message": "Password is required"},
                        ],
                    }
                ),
                400,
            )

        if not validate_email(email):
            return (
                jsonify(
                    {
                        "message": "Invalid email format",
                        "errors": [{"field": "email", "message": "Invalid email format"}],
                    }
                ),
                400,
            )

        
        user_query = supabase.table("users").select("*").eq("email", email).execute()
        user_data = user_query.data[0] if user_query.data else None

        if not user_data:
            return (
                jsonify(
                    {
                        "message": "Invalid credentials",
                        "errors": ["Invalid email or password"],
                    }
                ),
                401,
            )  

        
        hashed_password = user_data["password_hash"]
        if not bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8")):
            return (
                jsonify(
                    {
                        "message": "Invalid credentials",
                        "errors": ["Invalid email or password"],
                    }
                ),
                401,
            )  

        user_id = user_data["id"]
        role = user_data["role"]
        additional_data = {}

        
        if role == "student":
            student_query = supabase.table("students").select("*").eq("user_id", user_id).execute()
            student_data = student_query.data[0] if student_query.data else {}
            student_data.pop("user_id", None)
            student_data.pop("id", None)

        elif role == "teacher":
            teacher_query = supabase.table("teachers").select("*").eq("user_id", user_id).execute()
            teacher_data = teacher_query.data[0] if teacher_query.data else {}
            teacher_data.pop("user_id", None)
            teacher_data.pop("id", None)
        else:
            additional_data = {}

       

        user_data.pop("password_hash", None)  

        return jsonify(
            {
                "message": "Login successful",
                "user": {**user_data, **additional_data},  
            }
        ), 200

    except Exception as e:
        return (
            jsonify({"message": "Internal server error", "errors": [str(e)]}),
            500,
        )
