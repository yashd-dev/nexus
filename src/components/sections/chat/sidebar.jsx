// components/sections/chat/sidebar.jsx
"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Plus,
  Settings,
  Users,
  PowerIcon, // Import a suitable icon for the toggle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch"; // Import the Switch component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Dialog components
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Dummy subject data (replace with your actual data if needed)
const subjectData = [
  { id: "1", name: "Web Programming" },
  { id: "2", name: "Database Management Systems" },
  { id: "3", name: "Computer Vision Techniques" },
  { id: "4", name: "Design and Analysis of Algorithms" },
  { id: "5", name: "Data Structures" },
  { id: "6", name: "Operating Systems" },
  { id: "7", name: "Computer Networks" },
  { id: "8", name: "Artificial Intelligence" },
];

// Dummy semester data
const semesterData = [
  { id: "0e811cdd-4907-418a-8d14-f15edacd3dbc", semester_number: "5" },
  { id: "12c2cd1e-7ec7-4bd3-bcda-10231cedb81a", semester_number: "7" },
  { id: "12d852cd-117f-43e2-88de-60868a2755f6", semester_number: "4" },
  { id: "147d14a9-82b0-4303-8e0d-d06121cf45b2", semester_number: "8" },
  { id: "4c2775a1-ea40-4626-85cd-40995a67382e", semester_number: "12" },
  { id: "664637ce-6911-465a-8bd6-e127e9fa952e", semester_number: "1" },
  { id: "723a2565-0bee-4375-b8bd-451e647758bc", semester_number: "9" },
  { id: "99119de9-d94f-4b9f-93df-bcb9713af5e6", semester_number: "11" },
  { id: "a458f533-c71f-4675-b431-d5cb27a6ff2d", semester_number: "10" },
  { id: "e43106ca-35f8-437d-aeaf-6f5b568494d1", semester_number: "6" },
  { id: "f744f547-63c8-495e-b4a5-901ef5c0f126", semester_number: "2" },
  { id: "ffcd2131-d018-4f97-858f-3767b9b4a0e8", semester_number: "3" },
];

// Dummy group types as per API requirements
const groupTypes = [
  { id: "group", name: "Group" },
  { id: "personal", name: "Personal" },
];

export function Sidebar({ groups, onGroupSelect }) {
  const [expandedYears, setExpandedYears] = useState({
    y1: false,
    y2: true,
    y4: false,
  });

  const [expandedSemesters, setExpandedSemesters] = useState({
    y2s4: true,
  });

  const [isOutOfOffice, setIsOutOfOffice] = useState(false); // State for the toggle
  const [createGroupOpen, setCreateGroupOpen] = useState(false); // State for the create group dialog
  const [selectedSemester, setSelectedSemester] = useState(""); // State for the selected semester
  const [selectedSubject, setSelectedSubject] = useState(""); // State for the selected subject
  const [selectedGroupType, setSelectedGroupType] = useState(""); // State for the selected group type
  const { toast } = useToast();
  const router = useRouter();

  // Get user info from session storage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userRole = user?.role;
  const userName = user?.name;
  const userId = user?.id;
  const userAvatar = "/placeholder.svg?height=40&width=40"; // Replace with actual avatar URL

  const toggleYear = (yearId) => {
    setExpandedYears((prev) => ({
      ...prev,
      [yearId]: !prev[yearId],
    }));
  };

  const toggleSemester = (semesterId) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterId]: !prev[semesterId],
    }));
  };

  // Load out-of-office status from session storage on component mount
  useEffect(() => {
    const storedOutOfOffice = sessionStorage.getItem("outOfOffice");
    if (storedOutOfOffice) {
      setIsOutOfOffice(storedOutOfOffice === "true");
    }
  }, []);

  const toggleOutOfOffice = () => {
    setIsOutOfOffice((prev) => {
      const newValue = !prev;
      sessionStorage.setItem("outOfOffice", newValue.toString()); // Store in session
      // You can also make an API call to update the backend here if needed
      return newValue;
    });
  };

  const groupChats = groups.years
    .flatMap((year) => year.semesters)
    .flatMap((semester) => semester.divisions)
    .filter((division) => division.group_type !== "personal"); // ADDED group_type filter

  const personalChats = groups.years
    .flatMap((year) => year.semesters)
    .flatMap((semester) => semester.divisions)
    .filter((division) => division.group_type === "personal"); // ADDED group_type filter

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!selectedSemester || !selectedSubject || !selectedGroupType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the subject name from the selected subject ID
      const subjectName = subjectData.find(
        (subject) => subject.id === selectedSubject
      )?.name;

      // Prepare data for API
      const groupData = {
        user_id: userId,
        semester_id: selectedSemester,
        group_type: selectedGroupType,
        subject_name: subjectName,
      };

      // Send data to API
      const response = await fetch(`http://localhost:5000/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create group");
      }

      const data = await response.json();
      console.log("Group created successfully:", data);
      toast({
        title: "Success",
        description: "Group created successfully!",
      });

      setCreateGroupOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => setCreateGroupOpen(true)} // Open the dialog
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create new group</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              {groups.years.map((year) => (
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
                                      <span className=" truncate">
                                        {division.name}
                                      </span>
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
      {/* User Profile (Teachers Only) */}
      {userRole === "teacher" && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{userName}</span>
            </div>
          </div>
          {/* Out of Office Toggle */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm">Out of Office</span>
            <Switch
              id="out-of-office"
              checked={isOutOfOffice}
              onCheckedChange={toggleOutOfOffice}
            />
          </div>
        </div>
      )}

      {/* Create Group Dialog */}
      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a New Group</DialogTitle>
            <DialogDescription>
              Create a classroom group and share the invite link with your
              students.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGroup}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                    required
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesterData.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          Semester {semester.semester_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="group-type">Group Type</Label>
                  <Select
                    value={selectedGroupType}
                    onValueChange={setSelectedGroupType}
                    required
                  >
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
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  required
                >
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
    </div>
  );
}