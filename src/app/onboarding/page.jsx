"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Users, MessageSquare, Clock, Shield } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  { id: "10", name: "Software Engineering" },
  { id: "11", name: "Computer Architecture" },
  { id: "12", name: "Cybersecurity" },
  { id: "13", name: "Cloud Computing" },
  { id: "14", name: "Mobile App Development" },
  { id: "15", name: "Mathematics" },
  { id: "16", name: "Physics" },
  { id: "17", name: "Chemistry" },
  { id: "18", name: "Biology" },
]

// Group types as per API requirements
const groupTypes = [
  { id: "group", name: "Group" },
  { id: "personal", name: "Personal" },
]

// Backend URL - replace with your actual backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get("role") || "student"
  const [name, setName] = useState("there")
  const [userId, setUserId] = useState("")
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [joinGroupOpen, setJoinGroupOpen] = useState(false)
  const [outOfOfficeEnabled, setOutOfOfficeEnabled] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [inviteLink, setInviteLink] = useState("")
  const [generatedInviteLink, setGeneratedInviteLink] = useState("")
  const { toast } = useToast()

  // State for API data
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for form
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedGroupType, setSelectedGroupType] = useState("")

  // Fetch semesters from API
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/semesters`)
        if (!response.ok) {
          throw new Error("Failed to fetch semesters")
        }
        const data = await response.json()
        setSemesters(data)
      } catch (err) {
        setError(err.message)
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
  }, [toast])

  useEffect(() => {
    const user = sessionStorage.getItem("user")
    if (user == null) {
      window.location.href = "/access-account"
    }
    const userData = JSON.parse(user)
    setName(userData.name)
    setUserId(userData.id)

    if (role != userData.role) {
      router.push(`/onboarding?role=${userData.role}`)
    }
  }, [role, router])

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

      // Prepare data for API
      const groupData = {
        user_id: userId,
        semester_id: selectedSemester,
        group_type: selectedGroupType,
        subject_name: subjectName,
      }

      // Send data to API
      const response = await fetch(`${BACKEND_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create group")
      }

      const data = await response.json()

      // Set the generated join link
      const fullJoinLink = `${window.location.origin}${data.join_link}`
      setGeneratedInviteLink(fullJoinLink)

      toast({
        title: "Success",
        description: "Group created successfully!",
      })
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

      // Send join request to API
      const response = await fetch(`${BACKEND_URL}/api/groups/join/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to join group")
      }

      toast({
        title: "Success",
        description: "You've joined the group successfully!",
      })

      setJoinGroupOpen(false)
      router.push("/chat")
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to join group. Please check the invite link or code.",
        variant: "destructive",
      })
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className={`h-1 w-8 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className={`h-1 w-8 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`}></div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
          </div>
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <div className="p-8 rounded-t-lg">
              <h1 className="text-3xl font-bold mb-2">Welcome, {name} 👋</h1>
              <p className="text-xl text-muted-foreground">
                {role === "teacher"
                  ? "Let's set up your classroom and connect with your students!"
                  : "Let's join your classroom and start learning!"}
              </p>
            </div>
            <div className="border border-muted"></div>

            <div className="p-8">
              {role === "teacher" && (
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Create Your First Group</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Create a classroom group and share the invite link with your students to get started.
                      </p>
                      <Button onClick={() => setCreateGroupOpen(true)} className="w-full md:w-auto">
                        Create Group <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Out-of-Office Mode</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Enable AI assistance to answer student questions when you're unavailable.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="out-of-office"
                          checked={outOfOfficeEnabled}
                          onCheckedChange={setOutOfOfficeEnabled}
                        />
                        <Label htmlFor="out-of-office">{outOfOfficeEnabled ? "Enabled" : "Disabled"}</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      Privacy & AI Assistant
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI assistant helps answer common questions when you're unavailable. You maintain full control
                      over when it's active, and can review all interactions. Student data is always protected and never
                      used for training AI models.
                    </p>
                  </div>
                </div>
              )}

              {role === "student" && (
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Join Your Classroom</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Use the invite link from your teacher to join your classroom group instantly.
                      </p>
                      <Button onClick={() => setJoinGroupOpen(true)} className="w-full md:w-auto">
                        Join Group <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Start Learning</h2>
                      </div>
                      <p className="text-muted-foreground">
                        Ask questions directly to your teacher or get help from the AI assistant when they're away.
                      </p>
                      <Button variant="outline" onClick={() => router.push("/chat")} className="w-full md:w-auto">
                        Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      How It Works
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions anytime! Your teacher will respond when available. When your teacher enables
                      Out-of-Office mode, our AI assistant can help with immediate answers to common questions. Your
                      privacy is always protected.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
                      ) : error ? (
                        <SelectItem value="error" disabled>
                          Error loading semesters
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

              {generatedInviteLink && (
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="invite-link">Invite Link</Label>
                  <div className="flex gap-2">
                    <Input id="invite-link" value={generatedInviteLink} readOnly className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedInviteLink)
                        toast({
                          title: "Invite link copied to clipboard",
                          description: "Share this link with your students to invite them to your group.",
                        })
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this link with your students to invite them to your group.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              {!generatedInviteLink ? (
                <Button type="submit">Create Group</Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setCreateGroupOpen(false)
                    router.push("/dashboard")
                  }}
                >
                  Continue to Dashboard
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                      placeholder="https://app.classroom.ai/join/..."
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
    </div>
  )
}
