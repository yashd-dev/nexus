// components/sections/chat/chat-layout.jsx
"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sections/chat/sidebar";
import { ChatArea } from "@/components/sections/chat/chat-area";

export default function ChatLayout({ groupId }) {
  // Accept groupId as a prop
  const [groups, setGroups] = useState({ years: [] });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get userId from session storage
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = JSON.parse(sessionStorage.getItem("user"))["id"];

        if (!userId) {
          setError(
            "User ID not found in session storage. Please log in again."
          );
          setLoading(false);
          return;
        }

        // Fetch user info including role and teacher/student ID
        // const response = await fetch(`https://localhost:5000/api/groups/get-user-info?user_id="${userId}"`);

        // if (!response.ok) {
        //   throw new Error('Failed to fetch user information');
        // }

        // Fetch groups based on user role
        if (user.role === "teacher") {
          await fetchTeacherGroups(userId);
        } else if (user.role === "student") {
          await fetchStudentGroups(userId);
        } else {
          setError("Unknown user role");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    console.log("userInfo", groupId);
    fetchUserInfo();
  }, []);

  // Fetch groups for teachers
  const fetchTeacherGroups = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/teacher-groups?user_id=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch teacher groups");
      }

      const data = await response.json();

      // Transform API response to match our hierarchical structure
      const transformedGroups = transformGroupsToHierarchy(data.groups);
      setGroups(transformedGroups);

      // Find active group if any.  If a groupId is provided, use that instead
      let activeGroup;
      if (groupId) {
        activeGroup = { id: groupId }; // Use the groupId prop
      } else {
        activeGroup = findActiveGroup(transformedGroups);
      }
      if (activeGroup) {
        await fetchGroupDetails(activeGroup.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch groups for students
  const fetchStudentGroups = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/student-groups?user_id=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student groups");
      }

      const data = await response.json();

      // Transform API response to match our hierarchical structure
      const transformedGroups = transformGroupsToHierarchy(data.groups);
      setGroups(transformedGroups);

      // Find active group if any. If a groupId is provided, use that instead
      let activeGroup;
      if (groupId) {
        activeGroup = { id: groupId }; // Use the groupId prop
      } else {
        activeGroup = findActiveGroup(transformedGroups);
      }
      if (activeGroup) {
        await fetchGroupDetails(activeGroup.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Transform flat list of groups to hierarchical structure by semester
  const transformGroupsToHierarchy = (groups) => {
    const hierarchy = { years: [] };
    const semesterMap = {};

    // Group by semester number
    groups.forEach((group) => {
      const semesterNumber = group.semester_number || "Unknown";

      if (!semesterMap[semesterNumber]) {
        semesterMap[semesterNumber] = {
          id: `sem-${semesterNumber}`,
          name: `Semester ${semesterNumber}`,
          divisions: [],
        };
      }

      semesterMap[semesterNumber].divisions.push({
        id: group.id,
        name: group.subject_name,
        // Set first group as active if none is active yet
        active:
          semesterMap[semesterNumber].divisions.length === 0 &&
          Object.keys(semesterMap).length === 1,
      });
    });

    hierarchy.years.push({
      id: "current",
      name: "Current Year",
      semesters: Object.values(semesterMap),
    });

    return hierarchy;
  };

  // Find active group in hierarchy
  function findActiveGroup(data) {
    for (const year of data.years || []) {
      for (const semester of year.semesters || []) {
        for (const division of semester.divisions || []) {
          if (division.active) {
            return {
              id: division.id,
              name: division.name,
            };
          }
        }
      }
    }

    // If no active group, return the first one if available
    if (
      data.years?.length > 0 &&
      data.years[0].semesters?.length > 0 &&
      data.years[0].semesters[0].divisions?.length > 0
    ) {
      const firstDivision = data.years[0].semesters[0].divisions[0];
      return {
        id: firstDivision.id,
        name: firstDivision.name,
      };
    }

    return null;
  }

  // Fetch detailed info for a group
  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/group-details/${groupId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch group details");
      }

      const groupData = await response.json();

      // Transform API response to match our component's expected structure
      setSelectedGroup({
        id: groupData.id,
        name: groupData.subject_name,
        description: `${groupData.subject_name} - Semester ${groupData.semester_number}`,
        teachers: [
          {
            id: groupData.teacher.id,
            name: groupData.teacher.name,
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ],
        resources: [], // Add resources if needed
        students: groupData.students,
        messageCount: groupData.message_count,
      });
    } catch (err) {
      console.error("Error fetching group details:", err);
    }
  };

  const handleGroupSelect = async (groupId) => {
    // Update active state in groups
    const updatedGroups = { ...groups };
    updatedGroups.years.forEach((y) => {
      y.semesters.forEach((s) => {
        s.divisions.forEach((d) => {
          d.active = d.id === groupId;
        });
      });
    });
    setGroups(updatedGroups);

    // Fetch details for the selected group
    await fetchGroupDetails(groupId);
  };

  // useEffect to fetch group details when groupId changes
  useEffect(() => {
    if (groupId) {
      fetchGroupDetails(groupId);
    }
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading groups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        groups={groups}
        onGroupSelect={handleGroupSelect}
        userRole={userInfo?.role}
      />
      <ChatArea selectedGroup={selectedGroup} userInfo={userInfo} />
    </div>
  );
}
