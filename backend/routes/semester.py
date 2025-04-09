
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
        return jsonify({"error": str(e)}), 500