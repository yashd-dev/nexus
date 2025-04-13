"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sections/chat/sidebar"
import { ChatArea } from "@/components/sections/chat/chat-area"
import { MainSkeleton } from "@/components/skeletons/main-skeleton"
import { useGroups } from "@/hooks/use-groups"
import { useAuth } from "@/contexts/auth-context"

export default function ChatLayout({ groupId }) {
  const { groups, loading: groupsLoading, error: groupsError, getGroupDetails } = useGroups()
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchInitialGroup = async () => {
      try {
        if (groupId) {
          // If a specific group ID is provided, fetch that group
          const groupDetails = await getGroupDetails(groupId)
          setSelectedGroup(groupDetails)
        } else if (groups.years.length > 0) {
          // Otherwise, find the first active group or the first group available
          const activeGroup = findActiveGroup(groups)
          if (activeGroup) {
            const groupDetails = await getGroupDetails(activeGroup.id)
            setSelectedGroup(groupDetails)
          }
        }
      } catch (err) {
        console.error("Error fetching initial group:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!groupsLoading && !groupsError) {
      fetchInitialGroup()
    }
  }, [groupId, groups, groupsLoading, groupsError, getGroupDetails])

  function findActiveGroup(data) {
    for (const year of data.years || []) {
      for (const semester of year.semesters || []) {
        for (const division of semester.divisions || []) {
          if (division.active) {
            return {
              id: division.id,
              name: division.name,
            }
          }
        }
      }
    }

    if (
      data.years?.length > 0 &&
      data.years[0].semesters?.length > 0 &&
      data.years[0].semesters[0].divisions?.length > 0
    ) {
      const firstDivision = data.years[0].semesters[0].divisions[0]
      return {
        id: firstDivision.id,
        name: firstDivision.name,
      }
    }

    return null
  }

  const handleGroupSelect = async (groupId) => {
    try {
      // Update the active state in the groups data
      const updatedGroups = { ...groups }
      updatedGroups.years.forEach((y) => {
        y.semesters.forEach((s) => {
          s.divisions.forEach((d) => {
            d.active = d.id === groupId
          })
        })
      })

      // Fetch the details of the selected group
      const groupDetails = await getGroupDetails(groupId)
      setSelectedGroup(groupDetails)
    } catch (err) {
      console.error("Error selecting group:", err)
      setError(err.message)
    }
  }

  if (groupsLoading || loading) {
    return <MainSkeleton />
  }

  if (groupsError || error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error: {groupsError || error}</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar groups={groups} onGroupSelect={handleGroupSelect} userRole={user?.role} />
      <ChatArea selectedGroup={selectedGroup} />
    </div>
  )
}
