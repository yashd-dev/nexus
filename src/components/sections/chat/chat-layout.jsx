"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sections/chat/sidebar";
import { ChatArea } from "@/components/sections/chat/chat-area";

const initialGroups = {
  years: [
    {
      id: "y1",
      name: "Year 1",
      semesters: [
        {
          id: "y1s1",
          name: "Semester 1",
          divisions: [
            { id: "y1s1d1", name: "Physics BTI Sem 1 Div A" },
            { id: "y1s1d2", name: "Physics BTI Sem 1 Div B" },
          ],
        },
        {
          id: "y1s2",
          name: "Semester 2",
          divisions: [
            { id: "y1s2d1", name: "Physics BTI Sem 2 Div A" },
            { id: "y1s2d2", name: "Physics BTI Sem 2 Div B" },
          ],
        },
      ],
    },
    {
      id: "y2",
      name: "Year 2",
      semesters: [
        {
          id: "y2s3",
          name: "Semester 3",
          divisions: [
            { id: "y2s3d1", name: "Physics BTI Sem 3 Div A" },
            { id: "y2s3d2", name: "Physics BTI Sem 3 Div B" },
          ],
        },
        {
          id: "y2s4",
          name: "Semester 4",
          divisions: [
            { id: "y2s4d1", name: "Physics BTI Sem 4 Div A" },
            { id: "y2s4d2", name: "Physics BTI Sem 4 Div B", active: true },
          ],
        },
      ],
    },
    {
      id: "y4",
      name: "Year 4",
      semesters: [
        {
          id: "y4s8",
          name: "Semester 8",
          divisions: [{ id: "y4s8d1", name: "Physics BTI Sem 8" }],
        },
      ],
    },
  ],
};

export default function ChatLayout() {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState(
    findActiveGroup(groups) || {
      id: "y2s4d2",
      name: "Physics BTI Sem 4 Div B",
      description:
        "Main group containing course materials and discussions for Physics BTI Semester 4.",
      link: "https://nexus.org/BTI/physics/sem4-page",
      teachers: [
        {
          id: "t1",
          name: "Miss Doubtfire",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      resources: [
        {
          id: "r1",
          name: "Practical_Time_Table_BTI.pdf",
          type: "pdf",
          thumbnail: "/placeholder.svg?height=150&width=150",
        },
      ],
    }
  );

  function findActiveGroup(data) {
    for (const year of data.years) {
      for (const semester of year.semesters) {
        for (const division of semester.divisions) {
          if (division.active) {
            return {
              id: division.id,
              name: division.name,
              description: `Main group for ${division.name}`,
              teachers: [],
              resources: [],
            };
          }
        }
      }
    }
    return null;
  }

  const handleGroupSelect = (groupId) => {
    // Find the selected group in the hierarchy
    for (const year of groups.years) {
      for (const semester of year.semesters) {
        for (const division of semester.divisions) {
          if (division.id === groupId) {
            setSelectedGroup({
              id: division.id,
              name: division.name,
              description: `Main group for ${division.name}`,
              teachers: [
                {
                  id: "t1",
                  name: "Miss Doubtfire",
                  avatar: "/placeholder.svg?height=40&width=40",
                },
              ],
              resources: [
                {
                  id: "r1",
                  name: "Practical_Time_Table_BTI.pdf",
                  type: "pdf",
                  thumbnail: "/placeholder.svg?height=150&width=150",
                },
              ],
            });

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
            return;
          }
        }
      }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar groups={groups} onGroupSelect={handleGroupSelect} />
      <ChatArea selectedGroup={selectedGroup} />
    </div>
  );
}
