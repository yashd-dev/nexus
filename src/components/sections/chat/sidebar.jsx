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

  // Load out-of-office status from session storage on component mount
  useEffect(() => {
    const storedOutOfOffice = sessionStorage.getItem("outOfOffice");
    if (storedOutOfOffice) {
      setIsOutOfOffice(storedOutOfOffice === "true");
    }
  }, []);

  // Function to toggle out-of-office status
  const toggleOutOfOffice = () => {
    setIsOutOfOffice((prev) => {
      const newValue = !prev;
      sessionStorage.setItem("outOfOffice", newValue.toString()); // Store in session
      // You can also make an API call to update the backend here if needed
      return newValue;
    });
  };

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

  // Extract user info from session storage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userRole = user?.role;
  const userName = user?.name;
  const userAvatar = "/placeholder.svg?height=40&width=40"; // Replace with actual avatar URL

  const groupChats = groups.years
    .flatMap((year) => year.semesters)
    .flatMap((semester) => semester.divisions)
    .filter((division) => division.group_type !== "personal"); // ADDED group_type filter

  const personalChats = groups.years
    .flatMap((year) => year.semesters)
    .flatMap((semester) => semester.divisions)
    .filter((division) => division.group_type === "personal"); // ADDED group_type filter

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
          <div>
            <div className="flex items-center gap-2 px-4 text-xs uppercase font-medium text-muted-foreground">
              <span>Your Chats</span>
            </div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 hover:bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span>Direct Messages</span>
                </div>
              </Button>
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
    </div>
  );
}