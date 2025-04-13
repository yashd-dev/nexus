"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

export function useGroups() {
  const [groups, setGroups] = useState({ years: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchGroups = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (userError) throw userError

      if (userData.role === "teacher") {
        // Get teacher ID
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (teacherError) throw teacherError

        // Get groups where this user is a teacher
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select(`
            id,
            subject_name,
            group_type,
            semester_id,
            semesters:semester_id (
              id,
              semester_number
            )
          `)
          .eq("teacher_id", teacherData.id)

        if (groupsError) throw groupsError

        const transformedGroups = transformGroupsToHierarchy(groupsData)
        setGroups(transformedGroups)
      } else if (userData.role === "student") {
        // Get student ID
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (studentError) throw studentError

        // Get groups where this user is a student member
        const { data: groupMembers, error: memberError } = await supabase
          .from("group_members")
          .select("group_id")
          .eq("student_id", studentData.id)

        if (memberError) throw memberError

        if (!groupMembers || groupMembers.length === 0) {
          setGroups({ years: [] })
          setLoading(false)
          return
        }

        const groupIds = groupMembers.map((member) => member.group_id)

        // Get the group details
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select(`
            id,
            subject_name,
            group_type,
            semester_id,
            semesters:semester_id (
              id,
              semester_number
            )
          `)
          .in("id", groupIds)

        if (groupsError) throw groupsError

        const transformedGroups = transformGroupsToHierarchy(groupsData)
        setGroups(transformedGroups)
      }
    } catch (err) {
      console.error("Error fetching groups:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchGroups()
    }
  }, [user, fetchGroups])

  const transformGroupsToHierarchy = (groups) => {
    const hierarchy = { years: [] }
    const semesterMap = {}

    groups.forEach((group) => {
      const semesterNumber = group.semesters?.semester_number || "Unknown"

      if (!semesterMap[semesterNumber]) {
        semesterMap[semesterNumber] = {
          id: `sem-${semesterNumber}`,
          name: `Semester ${semesterNumber}`,
          divisions: [],
        }
      }

      semesterMap[semesterNumber].divisions.push({
        id: group.id,
        name: group.subject_name,
        group_type: group.group_type,
        active: semesterMap[semesterNumber].divisions.length === 0 && Object.keys(semesterMap).length === 1,
      })
    })

    hierarchy.years.push({
      id: "current",
      name: "Current Year",
      semesters: Object.values(semesterMap),
    })

    return hierarchy
  }

  const getGroupDetails = useCallback(async (groupId) => {
    try {
      // Get the group details
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select(`
          id,
          subject_name,
          group_type,
          semester_id,
          teacher_id,
          semesters:semester_id (
            id,
            semester_number
          )
        `)
        .eq("id", groupId)
        .single()

      if (groupError) throw groupError

      // Get the teacher details
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select(`
          id,
          is_available,
          users:user_id (
            id,
            name,
            email
          )
        `)
        .eq("id", group.teacher_id)
        .single()

      if (teacherError) throw teacherError

      // Get the group members (students)
      const { data: members, error: membersError } = await supabase
        .from("group_members")
        .select(`
          id,
          student_id,
          students:student_id (
            id,
            user_id,
            users:user_id (
              id,
              name,
              email
            )
          )
        `)
        .eq("group_id", groupId)

      if (membersError) throw membersError

      // Get the message count
      const { count, error: countError } = await supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("group_id", groupId)

      if (countError) throw countError

      // Format the data
      const teachers = [
        {
          id: teacherData.users.id,
          name: teacherData.users.name,
          avatar: "/placeholder.svg?height=40&width=40",
          is_available: teacherData.is_available,
        },
      ]

      const students = members.map((member) => ({
        id: member.students?.users?.id || "unknown",
        name: member.students?.users?.name || "Unknown Student",
      }))

      return {
        id: group.id,
        name: group.subject_name,
        description: `${group.subject_name} - Semester ${group.semesters.semester_number}`,
        teachers,
        students,
        messageCount: count || 0,
        resources: [],
        semester_id: group.semester_id,
      }
    } catch (err) {
      console.error("Error fetching group details:", err)
      throw err
    }
  }, [])

  const createGroup = async (groupData) => {
    try {
      // Get teacher ID for the current user
      const { data: teacherData, error: teacherError } = await supabase
        .from("teachers")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (teacherError) throw teacherError

      // Insert the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          subject_name: groupData.subject_name,
          teacher_id: teacherData.id,
          semester_id: groupData.semester_id,
          group_type: groupData.group_type,
        })
        .select()
        .single()

      if (groupError) throw groupError

      // Refresh groups after creating a new one
      fetchGroups()

      return { success: true, group }
    } catch (err) {
      console.error("Error creating group:", err)
      return { success: false, error: err.message }
    }
  }

  const joinGroup = async (groupId) => {
    try {
      // Get student ID for the current user
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (studentError) throw studentError

      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        student_id: studentData.id,
      })

      if (error) throw error

      // Refresh groups after joining a new one
      fetchGroups()

      return { success: true }
    } catch (err) {
      console.error("Error joining group:", err)
      return { success: false, error: err.message }
    }
  }

  return {
    groups,
    loading,
    error,
    createGroup,
    joinGroup,
    getGroupDetails,
    refreshGroups: fetchGroups,
  }
}