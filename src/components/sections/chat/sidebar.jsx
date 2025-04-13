"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Hash, Plus, Settings, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

// CS-related subjects
const subjectData = [
  { id: "1", name: "Web Programming" },
  { id: "2", name: "Database Management Systems" },
  { id: "3", name: "Computer Vision Techniques" },
  { id: "4", name: "Design and Analysis of Algorithms" },
  { id: "5", name: "Data Structures" },
  { id: "6", name: "Operating Systems" },
  { id: "7", name: "Computer Networks" },
  { id: "8", name: "Artificial Intelligence" },
  { id: "9", name: "Machine Learning" },
]

// Group types
const groupTypes = [
  { id: "group", name: "Group" },
  { id: "personal", name: "Personal" },
]

export function Sidebar({ groups, onGroupSelect }) {
  const [expandedYears, setExpandedYears] = useState({})
  const [expandedSemesters, setExpandedSemesters] = useState({})
  const [isOutOfOffice, setIsOutOfOffice] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [joinGroupOpen, setJoinGroupOpen] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedGroupType, setSelectedGroupType] = useState("group")
  const { toast } = useToast()
  const router = useRouter()
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Fetch semesters from Supabase
    const fetchSemesters = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("semesters")
          .select("*")
          .order("semester_number", { ascending: true })

        if (error) throw error
        setSemesters(data)
      } catch (err) {
        console.error("Error fetching semesters:", err)
        toast({
          title: "Error",
          description: "Failed to load semesters. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSemesters()

    // Get user data from sessionStorage
    const userStr = sessionStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserData(user)

      // If user is a teacher, fetch their availability status
      if (user.role === "teacher") {
        const fetchTeacherStatus = async () => {
          try {
            const { data, error } = await supabase
              .from("teachers")
              .select("is_available")
              .eq("user_id", user.id)
              .single()

            if (!error && data) {
              setIsOutOfOffice(!data.is_available)
            }
          } catch (err) {
            console.error("Error fetching teacher status:", err)
          }
        }
        fetchTeacherStatus()
      }
    }
  }, [toast])

  // Initialize expanded state for years and semesters
  useEffect(() => {
    if (groups && groups.years) {
      // Set the first year as expanded by default
      const initialExpandedYears = {}
      groups.years.forEach((year, index) => {
        initialExpandedYears[year.id] = index === 0
      })
      setExpandedYears(initialExpandedYears)

      // Set the first semester of the first year as expanded by default
      const initialExpandedSemesters = {}
      if (groups.years.length > 0 && groups.years[0].semesters.length > 0) {
        initialExpandedSemesters[groups.years[0].semesters[0].id] = true
      }
      setExpandedSemesters(initialExpandedSemesters)
    }
  }, [groups])

  const toggleYear = (yearId) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearId]: !prev[yearId],
    }))
  }

  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }))
  }

  const toggleOutOfOffice = async () => {
    if (!userData || userData.role !== "teacher") return

    const newValue = !isOutOfOffice
    setIsOutOfOffice(newValue)

    try {
      // Update the is_available flag in the teachers table
      const { error } = await supabase.from("teachers").update({ is_available: !newValue }).eq("user_id", userData.id)

      if (error) throw error

      toast({
        title: newValue ? "Out of Office Enabled" : "Out of Office Disabled",
        description: newValue
          ? "AI assistant will now respond to student messages"
          : "You will now receive all student messages directly",
      })
    } catch (err) {
      console.error("Error updating out of office status:", err)
      toast({
        title: "Error",
        description: "Failed to update your status. Please try again.",
        variant: "destructive",
      })
      // Revert the UI state
      setIsOutOfOffice(!newValue)
    }
  }

  const handleLogout = () => {
    // Clear user from sessionStorage
    sessionStorage.removeItem("user")
    router.push("/access-account")
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!selectedSemester || !selectedSubject || !selectedGroupType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get the subject name from the selected subject ID
      const subjectName = subjectData.find((subject) => subject.id === selectedSubject)?.name

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          subject_name: subjectName,
          teacher_id: userData.id,
          semester_id: selectedSemester,
          group_type: selectedGroupType,
        })
        .select()
        .single()

      if (groupError) throw groupError

      toast({
        title: "Success",
        description: "Group created successfully!",
      })

      setCreateGroupOpen(false)
      router.refresh()
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create group. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleJoinGroup = async (e) => {
    e.preventDefault()

    try {
      // Extract group ID from the invite link or code
      let groupId

      // Simple parsing - in a real app, you'd want more robust parsing
      if (inviteLink.includes("/join/")) {
        groupId = inviteLink.split("/join/")[1]
      } else {
        // Assume it's a direct group ID
        groupId = inviteLink
      }

      if (!groupId) {
        throw new Error("Invalid invite link or code")
      }

      // Join the group
      const { error: joinError } = await supabase.from("group_members").insert({
        group_id: groupId,
        student_id: userData.id,
      })

      if (joinError) throw joinError

      toast({
        title: "Success",
        description: "You've joined the group successfully!",
      })

      setJoinGroupOpen(false)
      router.refresh()
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to join group. Please check the invite link or code.",
        variant: "destructive",
      })
    }
  }

  const userRole = userData?.role || "student"
  const isTeacher = userRole === "teacher"

  return (
    <div className="border-r w-64 flex-shrink-0 flex flex-col h-screen">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Users className="h-4 w-4" />
          </div>
          <span className="font-semibold">Nexus</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 px-4 text-xs uppercase font-medium text-muted-foreground">
              <span>Your Groups</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isTeacher ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => setCreateGroupOpen(true)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => setJoinGroupOpen(true)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>{isTeacher ? "Create new group" : "Join a group"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              {groups?.years?.map((year) => (
                <div key={year.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 hover:bg-secondary/50"
                    onClick={() => toggleYear(year.id)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedYears[year.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span>{year.name}</span>
                    </div>
                  </Button>
                  {expandedYears[year.id] && (
                    <div className="ml-4 space-y-1">
                      {year.semesters.map((semester) => (
                        <div key={semester.id}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start px-4 py-2 hover:bg-secondary/50"
                            onClick={() => toggleSemester(semester.id)}
                          >
                            <div className="flex items-center gap-2">
                              {expandedSemesters[semester.id] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span>{semester.name}</span>
                            </div>
                          </Button>
                          {expandedSemesters[semester.id] && (
                            <div className="ml-4 space-y-1">
                              {semester.divisions.map((division) => (
                                <Link
                                  key={division.id}
                                  href={`/chat/${division.id}`}
                                  className="w-full"
                                  onClick={() => onGroupSelect(division.id)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start px-4 py-2 hover:bg-secondary/50"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Hash className="h-4 w-4" />
                                      <span className="truncate">{division.name}</span>
                                    </div>
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userData?.name} />
              <AvatarFallback>
                <Users className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userData?.name}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Out of Office Toggle (Teachers Only) */}
        {isTeacher && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm">Out of Office</span>
            <Switch id="out-of-office" checked={isOutOfOffice} onCheckedChange={toggleOutOfOffice} />
          </div>
        )}
      </div>

      {/* Create Group Dialog (Teachers Only) */}
      {isTeacher && (
        <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create a New Group</DialogTitle>
              <DialogDescription>
                Create a classroom group and share the invite link with your students.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroup}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester} required>
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : (
                          semesters.map((semester) => (
                            <SelectItem key={semester.id} value={semester.id}>
                              Semester {semester.semester_number}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="group-type">Group Type</Label>
                    <Select value={selectedGroupType} onValueChange={setSelectedGroupType} required>
                      <SelectTrigger id="group-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectData.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Create Group</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Join Group Dialog (Student Only) */}
      {!isTeacher && (
        <Dialog open={joinGroupOpen} onOpenChange={setJoinGroupOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Join a Group</DialogTitle>
              <DialogDescription>Enter the invite link or code provided by your teacher.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleJoinGroup}>
              <div className="grid gap-4 py-4">
                <Tabs defaultValue="link" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="link">Invite Link</TabsTrigger>
                    <TabsTrigger value="code">Invite Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="link" className="mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="invite-link">Invite Link</Label>
                      <Input
                        id="invite-link"
                        placeholder="https://app.nexus.com/join/..."
                        value={inviteLink}
                        onChange={(e) => setInviteLink(e.target.value)}
                        required
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="code" className="mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="invite-code">Invite Code</Label>
                      <Input
                        id="invite-code"
                        placeholder="Enter group ID"
                        value={inviteLink}
                        onChange={(e) => setInviteLink(e.target.value)}
                        required
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter>
                <Button type="submit">Join Group</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}