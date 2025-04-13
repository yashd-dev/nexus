
from flask import Blueprint, jsonify, current_app
teacher_bp = Blueprint("teacher", __name__)

@teacher_bp.route("/groups", methods=["GET"])
def get_teacher_groups():
    teacher_id = request.args.get("teacher_id")
    
    if not teacher_id:
        return jsonify({"error": "Teacher ID is required"}), 400
    
    try:
        # Fetch groups that have this teacher
        groups_response = supabase.table("groups").select(
            "id, group_type, subject_name, teacher_id, semester_id"
        ).eq("teacher_id", teacher_id).execute()
        
        if hasattr(groups_response, "error") and groups_response.error:
            return jsonify({"error": groups_response.error}), 500
        
        groups = groups_response.data
        
        # For each group, get semester details
        enhanced_groups = []
        for group in groups:
            # Get semester info
            semester_response = supabase.table("semesters").select(
                "id, semester_number"
            ).eq("id", group["semester_id"]).execute()
            
            semester = semester_response.data[0] if semester_response.data else None
            
            # Get count of students in this group
            students_count_response = supabase.table("group_members").select(
                "id", count="exact"
            ).eq("group_id", group["id"]).execute()
            
            students_count = students_count_response.count if hasattr(students_count_response, "count") else 0
            
            # Get recent messages
            recent_messages_response = supabase.table("messages").select(
                "id, content, timestamp, sender_id"
            ).eq("group_id", group["id"]).order("timestamp", desc=True).limit(5).execute()
            
            recent_messages = recent_messages_response.data if recent_messages_response.data else []
            
            # Combine all data
            enhanced_group = {
                **group,
                "semester": semester,
                "students_count": students_count,
                "recent_messages": recent_messages
            }
            
            enhanced_groups.append(enhanced_group)
        
        # Structure the response as per your frontend needs
        structured_response = organize_groups_by_semester(enhanced_groups)
        
        return jsonify(structured_response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def organize_groups_by_semester(groups):
    # Organize groups by semester
    semesters = {}
    years = {}
    
    for group in groups:
        semester_id = group["semester_id"]
        semester_num = group["semester"]["semester_number"] if group["semester"] else 0
        
        # Calculate year based on semester (assuming 2 semesters per year)
        year = (semester_num + 1) // 2
        
        if year not in years:
            years[year] = {
                "id": f"y{year}",
                "name": f"Year {year}",
                "semesters": {}
            }
        
        if semester_id not in years[year]["semesters"]:
            years[year]["semesters"][semester_id] = {
                "id": semester_id,
                "name": f"Semester {semester_num}",
                "divisions": []
            }
        
        # Add group as a division
        years[year]["semesters"][semester_id]["divisions"].append({
            "id": group["id"],
            "name": f"{group['subject_name']} {group['group_type']}",
            "students_count": group["students_count"],
            "recent_messages": group["recent_messages"]
        })
    
    # Convert to the format expected by frontend
    result = {
        "years": []
    }
    
    for year_id, year_data in sorted(years.items()):
        year_obj = {
            "id": year_data["id"],
            "name": year_data["name"],
            "semesters": []
        }
        
        for semester_id, semester_data in year_data["semesters"].items():
            year_obj["semesters"].append({
                "id": semester_data["id"],
                "name": semester_data["name"],
                "divisions": semester_data["divisions"]
            })
        
        result["years"].append(year_obj)
    
    return result

@teacher_bp.route("/api/group/details", methods=["GET"])
def get_group_details():
    group_id = request.args.get("group_id")
    
    if not group_id:
        return jsonify({"error": "Group ID is required"}), 400
    
    try:
        # Get basic group info
        group_response = supabase.table("groups").select(
            "id, group_type, subject_name, teacher_id, semester_id"
        ).eq("id", group_id).execute()
        
        if not group_response.data:
            return jsonify({"error": "Group not found"}), 404
        
        group = group_response.data[0]
        
        # Get teacher info
        teacher_response = supabase.table("teachers").select(
            "id, user_id, is_available"
        ).eq("id", group["teacher_id"]).execute()
        
        teacher = None
        if teacher_response.data:
            teacher_data = teacher_response.data[0]
            user_response = supabase.table("users").select(
                "id, name, email"
            ).eq("id", teacher_data["user_id"]).execute()
            
            if user_response.data:
                teacher = {
                    "id": teacher_data["id"],
                    "name": user_response.data[0]["name"],
                    "email": user_response.data[0]["email"],
                    "avatar": f"/placeholder.svg?height=40&width=40",
                    "is_available": teacher_data["is_available"]
                }
        
        # Get messages for this group
        messages_response = supabase.table("messages").select(
            "id, content, timestamp, sender_id, sender_role"
        ).eq("group_id", group_id).order("timestamp", asc=True).execute()
        
        messages = []
        for msg in messages_response.data:
            sender = None
            if msg["sender_role"] == "teacher":
                teacher_user_response = supabase.table("teachers").select(
                    "user_id"
                ).eq("id", msg["sender_id"]).execute()
                
                if teacher_user_response.data:
                    user_id = teacher_user_response.data[0]["user_id"]
                    user_response = supabase.table("users").select(
                        "name"
                    ).eq("id", user_id).execute()
                    
                    if user_response.data:
                        sender = {
                            "id": msg["sender_id"],
                            "name": user_response.data[0]["name"],
                            "avatar": f"/placeholder.svg?height=40&width=40"
                        }
            elif msg["sender_role"] == "student":
                student_user_response = supabase.table("students").select(
                    "user_id"
                ).eq("id", msg["sender_id"]).execute()
                
                if student_user_response.data:
                    user_id = student_user_response.data[0]["user_id"]
                    user_response = supabase.table("users").select(
                        "name"
                    ).eq("id", user_id).execute()
                    
                    if user_response.data:
                        sender = {
                            "id": msg["sender_id"],
                            "name": user_response.data[0]["name"],
                            "avatar": f"/placeholder.svg?height=40&width=40"
                        }
            
            if sender:
                messages.append({
                    "id": msg["id"],
                    "sender": sender,
                    "content": msg["content"],
                    "timestamp": msg["timestamp"]
                })
        
        # Prepare group details response
        semester_response = supabase.table("semesters").select(
            "semester_number"
        ).eq("id", group["semester_id"]).execute()
        semester_number = semester_response.data[0]["semester_number"] if semester_response.data else None
        
        group_details = {
            "id": group["id"],
            "name": f"{group['subject_name']} Sem {semester_number} {group['group_type']}",
            "description": f"Main group for {group['subject_name']} Semester {semester_number} {group['group_type']}",
            "teachers": [teacher] if teacher else [],
            "messages": messages,
            "resources": [
                {
                    "id": "r1",
                    "name": "Practical_Time_Table_BTI.pdf",
                    "type": "pdf",
                    "thumbnail": "/placeholder.svg?height=150&width=150"
                }
            ]
        }
        
        return jsonify(group_details), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

