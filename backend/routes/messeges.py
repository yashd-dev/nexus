from flask import Blueprint, request, jsonify, current_app
import uuid


message_bp = Blueprint("messages", __name__)


@message_bp.route("/send", methods=["POST"])
def send_message():

    supabase = current_app.config["supabase_client"]
    try:
        data = request.get_json()
        group_id = data.get("group_id")
        sender_id = data.get("sender_id")
        sender_role = data.get("sender_role")
        content = data.get("content")
        embedding = data.get("embedding")

        if not all([group_id, sender_id, sender_role, content]):
            return (
                jsonify(
                    {
                        "error": "Missing group_id, sender_id, sender_role, and content in request body",
                    }
                ),
                400,
            )

        if sender_role not in ("student", "teacher"):
            return jsonify({"error": "Invalid sender_role, must be 'student' or 'teacher'"}), 400

        message_id = str(uuid.uuid4())
        message_data = {
            "id": message_id,
            "group_id": group_id,
            "sender_id": sender_id,
            "sender_role": sender_role,
            "content": content,
            "timestamp": "now()",
            "embedding": embedding
        }

        supabase.table("messages").insert(message_data).execute()

        return jsonify({"message": "Message sent", "message_id": message_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@message_bp.route("/fetch/<group_id>", methods=["GET"])
def fetch_messages(group_id):
    supabase = current_app.config["supabase_client"]
    try:
        response = (
            supabase.table("messages")
            .select("*")
            .eq("group_id", group_id)
            .order("timestamp", desc=False)
            .execute()
        )

        messages = response.data

        # Add sender information to each message
        for message in messages:
            sender_id = message["sender_id"]
            sender_role = message["sender_role"]

            # Fetch user information from the users table
            user_response = supabase.table("users").select("name, email").eq("id", sender_id).execute()

            if user_response.data:
                user_data = user_response.data[0]
                message["sender_name"] = user_data["name"]
                message["sender_email"] = user_data["email"]  # Optional
                # Add avatar URL here (you might need to fetch it from another table if it's not in the users table)
                message["sender_avatar"] = "https://thispersondoesnotexist.com/"  # Replace with actual avatar URL


            else:
                message["sender_name"] = "Unknown User"  # Handle case where user is not found
                message["sender_avatar"] = "https://thispersondoesnotexist.com/"

        return jsonify(messages), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
