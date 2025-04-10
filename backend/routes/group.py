from flask import Blueprint, request, jsonify, current_app
import uuid
from urllib.parse import quote


group_bp = Blueprint("groups", __name__)


@group_bp.route("/create", methods=["POST"])
def create_group():
    supabase = current_app.config["supabase_client"]
    try:
        data = request.get_json()
        user_id = data.get("user_id")  # frontend sends user_id
        semester_id = data.get("semester_id")
        group_type = data.get("group_type")
        subject_name = data.get("subject_name")

        if not all([user_id, semester_id, group_type, subject_name]):
            return jsonify({
                "error": "Missing user_id, semester_id, group_type, and subject_name are required",
            }), 400

        if group_type not in ("group", "personal"):
            return jsonify({"error": "Invalid group_type, must be 'group' or 'personal'"}), 400

        # 🔍 Fetch teacher_id from teachers table using user_id
        teacher_response = supabase.table("teachers").select("*").eq("user_id", user_id).execute()
        print(teacher_response,type(teacher_response))

        # if teacher_response.error:
        #     return jsonify({"error": "Teacher not found"}), 404

        teacher_id = teacher_response.data[0]["id"]

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

    # Getting student id from user id
        student__id=supabase.table("students").select("id").eq("user_id", student_id).execute().data[0]["id"]

        group_member_data = {"group_id": group_id, "student_id": student__id}
        supabase.table("group_members").insert(group_member_data).execute()

        return jsonify({"message": f"Student {student_id} joined group {group_id}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@group_bp.route("/teacher-groups", methods=["GET"])
def get_teacher_groups():
    """
    Get all groups associated with a teacher based on user_id.
    Query parameter:
        user_id: UUID of the user
    Returns:
        200: List of groups
        400: Missing user_id
        404: Teacher not found
        500: Server error
    """
    supabase = current_app.config["supabase_client"]
    try:
        user_id = request.args.get("user_id")
        
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400
        
        # First, get the teacher_id from the teachers table
        teacher_response = supabase.table("teachers").select("id").eq("user_id", user_id).execute()
        
        if not teacher_response.data:
            return jsonify({"error": "Teacher not found for this user"}), 404
        
        teacher_id = teacher_response.data[0]["id"]
        
        # Now, get all groups for this teacher
        groups_response = supabase.table("groups").select(
            "id, subject_name, group_type, semester_id"
        ).eq("teacher_id", teacher_id).execute()
        
        # Get semester information for each group
        result_groups = []
        for group in groups_response.data:
            # Get semester information
            semester_response = supabase.table("semesters").select(
                "id, semester_number"
            ).eq("id", group["semester_id"]).execute()
            
            semester_number = None
            if semester_response.data:
                semester_number = semester_response.data[0]["semester_number"]
            
            # Get student count for this group
            members_count = supabase.table("group_members").select(
                "id", count="exact"
            ).eq("group_id", group["id"]).execute()
            
            student_count = members_count.count if hasattr(members_count, 'count') else 0
            
            # Get latest message timestamp
            latest_message = supabase.table("messages").select(
                "timestamp"
            ).eq("group_id", group["id"]).order("timestamp", desc=True).limit(1).execute()
            
            last_activity = None
            if latest_message.data:
                last_activity = latest_message.data[0]["timestamp"]
            
            group_data = {
                "id": group["id"],
                "subject_name": group["subject_name"],
                "group_type": group["group_type"],
                "semester_number": semester_number,
                "student_count": student_count,
                "last_activity": last_activity
            }
            result_groups.append(group_data)
        
        # Sort by last activity (newest first)
        result_groups.sort(key=lambda x: x["last_activity"] if x["last_activity"] else "", reverse=True)
        
        return jsonify({"groups": result_groups}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@group_bp.route("/student-groups", methods=["GET"])
def get_student_groups():
    """
    Get all groups a student is member of based on user_id.
    Query parameter:
        user_id: UUID of the user
    Returns:
        200: List of groups
        400: Missing user_id
        404: Student not found
        500: Server error
    """
    supabase = current_app.config["supabase_client"]
    try:
        user_id = request.args.get("user_id")
        
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400
        
        # First, get the student_id from the students table
        student_response = supabase.table("students").select("id").eq("user_id", user_id).execute()
        
        if not student_response.data:
            return jsonify({"error": "Student not found for this user"}), 404
        
        student_id = student_response.data[0]["id"]
        
        # Get all group memberships for this student
        memberships = supabase.table("group_members").select(
            "group_id"
        ).eq("student_id", student_id).execute()
        
        if not memberships.data:
            return jsonify({"groups": []}), 200
        
        # Get details for each group
        result_groups = []
        for membership in memberships.data:
            group_id = membership["group_id"]
            
            # Get group details
            group_response = supabase.table("groups").select(
                "id, subject_name, group_type, teacher_id, semester_id"
            ).eq("id", group_id).execute()
            
            if group_response.data:
                group = group_response.data[0]
                
                # Get teacher information
                teacher_response = supabase.table("teachers").select(
                    "user_id"
                ).eq("id", group["teacher_id"]).execute()
                
                teacher_name = "Unknown"
                if teacher_response.data:
                    teacher_user_id = teacher_response.data[0]["user_id"]
                    
                    # Get teacher name from users table
                    user_response = supabase.table("users").select(
                        "name"
                    ).eq("id", teacher_user_id).execute()
                    
                    if user_response.data:
                        teacher_name = user_response.data[0]["name"]
                
                # Get semester information
                semester_response = supabase.table("semesters").select(
                    "semester_number"
                ).eq("id", group["semester_id"]).execute()
                
                semester_number = None
                if semester_response.data:
                    semester_number = semester_response.data[0]["semester_number"]
                
                # Get latest message timestamp
                latest_message = supabase.table("messages").select(
                    "timestamp"
                ).eq("group_id", group["id"]).order("timestamp", desc=True).limit(1).execute()
                
                last_activity = None
                if latest_message.data:
                    last_activity = latest_message.data[0]["timestamp"]
                
                group_data = {
                    "id": group["id"],
                    "subject_name": group["subject_name"],
                    "group_type": group["group_type"],
                    "teacher_name": teacher_name,
                    "semester_number": semester_number,
                    "last_activity": last_activity
                }
                result_groups.append(group_data)
        
        # Sort by last activity (newest first)
        result_groups.sort(key=lambda x: x["last_activity"] if x["last_activity"] else "", reverse=True)
        
        return jsonify({"groups": result_groups}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@group_bp.route("/get-user-info", methods=["GET"])
def get_user_info():
    """
    Get user info including role and corresponding teacher/student ID.
    Query parameter:
        user_id: UUID of the user
    Returns:
        200: User info with role and ID
        400: Missing user_id
        404: User not found
        500: Server error
    """
    supabase = current_app.config["supabase_client"]
    try:
        user_id = request.args.get("user_id")
        
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400
        
        # Get user info from users table
        user_response = supabase.table("users").select("role, name, email").eq("id", user_id).execute()
        
        if not user_response.data:
            return jsonify({"error": "User not found"}), 404
        
        user_info = user_response.data[0]
        role = user_info.get("role")
        
        result = {
            "user_id": user_id,
            "name": user_info.get("name"),
            "email": user_info.get("email"),
            "role": role
        }
        
        # If teacher, get teacher_id
        if role == "teacher":
            teacher_response = supabase.table("teachers").select("id, is_available").eq("user_id", user_id).execute()
            
            if teacher_response.data:
                result["teacher_id"] = teacher_response.data[0]["id"]
                result["is_available"] = teacher_response.data[0]["is_available"]
        
        # If student, get student_id
        elif role == "student":
            student_response = supabase.table("students").select("id").eq("user_id", user_id).execute()
            
            if student_response.data:
                result["student_id"] = student_response.data[0]["id"]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@group_bp.route("/group-details/<group_id>", methods=["GET"])
def get_group_details(group_id):
    print("grp id", group_id)
    """
    Get detailed information about a specific group.
    Path parameter:
        group_id: UUID of the group
    Returns:
        200: Group details
        404: Group not found
        500: Server error
    """
    supabase = current_app.config["supabase_client"]
    try:
        # Get group details
        group_response = supabase.table("groups").select(
            "id, subject_name, group_type, teacher_id, semester_id"
        ).eq("id", group_id).execute()
        
        if not group_response.data:
            return jsonify({"error": "Group not found"}), 404
        
        group = group_response.data[0]
        
        # Get teacher information
        teacher_response = supabase.table("teachers").select(
            "user_id"
        ).eq("id", group["teacher_id"]).execute()
        
        teacher_name = "Unknown"
        teacher_email = None
        if teacher_response.data:
            teacher_user_id = teacher_response.data[0]["user_id"]
            
            # Get teacher name from users table
            user_response = supabase.table("users").select(
                "name, email"
            ).eq("id", teacher_user_id).execute()
            
            if user_response.data:
                teacher_name = user_response.data[0]["name"]
                teacher_email = user_response.data[0]["email"]
        
        # Get semester information
        semester_response = supabase.table("semesters").select(
            "semester_number"
        ).eq("id", group["semester_id"]).execute()
        
        semester_number = None
        if semester_response.data:
            semester_number = semester_response.data[0]["semester_number"]
        
        # Get group members
        members_response = supabase.table("group_members").select(
            "student_id"
        ).eq("group_id", group_id).execute()
        
        students = []
        for member in members_response.data:
            student_id = member["student_id"]
            
            # Get student user_id
            student_response = supabase.table("students").select(
                "user_id"
            ).eq("id", student_id).execute()
            
            if student_response.data:
                student_user_id = student_response.data[0]["user_id"]
                
                # Get student name from users table
                user_response = supabase.table("users").select(
                    "name, email"
                ).eq("id", student_user_id).execute()
                
                if user_response.data:
                    students.append({
                        "id": student_id,
                        "name": user_response.data[0]["name"],
                        "email": user_response.data[0]["email"]
                    })
        
        # Get message count
        message_count = supabase.table("messages").select(
            "id", count="exact"
        ).eq("group_id", group_id).execute()
        
        result = {
            "id": group["id"],
            "subject_name": group["subject_name"],
            "group_type": group["group_type"],
            "semester_number": semester_number,
            "teacher": {
                "id": group["teacher_id"],
                "name": teacher_name,
                "email": teacher_email
            },
            "students": students,
            "message_count": message_count.count if hasattr(message_count, 'count') else 0
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500