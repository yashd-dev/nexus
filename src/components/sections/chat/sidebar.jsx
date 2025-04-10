"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Hash,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar({ groups, onGroupSelect }) {
  const [expandedYears, setExpandedYears] = useState({
    y1: false,
    y2: true,
    y4: false,
  });

  const [expandedSemesters, setExpandedSemesters] = useState({
    y2s4: true,
  });

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

  return (
    <div className="border-r w-64 flex-shrink-0">
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
      <ScrollArea className="h-[calc(100vh-64px)]">
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
                                <Button
                                  key={division.id}
                                  variant="ghost"
                                  className="w-full justify-start px-4 py-2 hover:bg-secondary/50"
                                  onClick={() => onGroupSelect(division.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4" />
                                    <a
                                      href={`/chats/${division.id}`}
                                      className=" truncate"
                                    >
                                      {division.name}
                                    </a>
                                  </div>
                                </Button>
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
    </div>
  );
}
