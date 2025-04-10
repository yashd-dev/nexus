
from flask import Blueprint, jsonify, current_app

semester_bp = Blueprint("semester", __name__)

@semester_bp.route("/", methods=["GET"])
def get_semesters():
    supabase = current_app.config["supabase_client"]
    try:
        response = supabase.table("semesters").select("*").execute()
        semesters = response.data
        return jsonify(semesters), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 


@semester_bp.route("/<group_id>", methods=["GET"])
def get_semester(group_id):
    supabase = current_app.config["supabase_client"]
    try:
        response = supabase.table("groups").select("semester_id").eq("id", group_id).execute()

        if not response.data:
            return jsonify({"error": "Group not found"}), 404

        group_data = response.data[0]
        semester_id = group_data["semester_id"]

        semester_response = supabase.table("semesters").select("*").eq("id", semester_id).execute()

        if not semester_response.data:
            return jsonify({"error": "Semester not found"}), 404

        semester = semester_response.data[0]
        return jsonify(semester), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
