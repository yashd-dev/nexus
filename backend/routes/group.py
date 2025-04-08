from flask import Blueprint, request, jsonify, current_app
import uuid
from urllib.parse import quote


group_bp = Blueprint("groups", __name__)


@group_bp.route("/create", methods=["POST"])
def create_group():
   
    supabase = current_app.config["supabase_client"]
    try:
        data = request.get_json()
        teacher_id = data.get("teacher_id")
        semester_id = data.get("semester_id")
        group_type = data.get("group_type")
        subject_name = data.get("subject_name")

        if not all([teacher_id, semester_id, group_type, subject_name]):
            return (
                jsonify(
                    {
                        "error": "Missing teacher_id, semester_id, group_type, and subject_name are required",
                    }
                ),
                400,
            )

        
        if group_type not in ("group", "personal"):
            return jsonify({"error": "Invalid group_type, must be 'group' or 'personal'"}), 400

        group_id = str(uuid.uuid4())

        group_data = {
            "id": group_id,
            "teacher_id": teacher_id,
            "semester_id": semester_id,
            "group_type": group_type,
            "subject_name": subject_name,
        }
        supabase.table("groups").insert(group_data).execute()

        
        join_link = f"/api/groups/join/{group_id}"

        return jsonify({"message": "Group created", "group_id": group_id, "join_link": join_link}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@group_bp.route("/join/<group_id>", methods=["POST"])
def join_group(group_id):
    """
    Allows a student to join a group.
    Expects JSON:
        student_id: UUID of the student joining the group.
    Returns:
        200 on success
        400 on error or missing student_id
        500 database error
    """
    supabase = current_app.config["supabase_client"]
    try:
        data = request.get_json()
        student_id = data.get("student_id")

        if not student_id:
            return jsonify({"error": "Missing student_id in request body"}), 400

        group_member_data = {"group_id": group_id, "student_id": student_id}
        supabase.table("group_members").insert(group_member_data).execute()

        return jsonify({"message": f"Student {student_id} joined group {group_id}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
