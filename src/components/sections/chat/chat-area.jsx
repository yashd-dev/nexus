"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Copy, Download, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatArea({ selectedGroup }) {
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: {
        id: "t1",
        name: "Miss Doubtfire",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "In view of convenience and compatibility of students, I have decided that students to form their own group of 3-4 students. You are required to complete this by 4 and post on this list by Friday.",
      timestamp: new Date(2023, 2, 15, 10, 30),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message = {
      id: Date.now().toString(),
      sender: {
        id: "current-user",
        name: "Miss Doubtfire",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">
          Select a group to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{selectedGroup.name}</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col h-full">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar>
                    <AvatarImage
                      src={message.sender.avatar}
                      alt={message.sender.name}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.sender.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />{" "}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 border-l bg-muted/20 p-4 overflow-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {selectedGroup.description}
              </p>
              {selectedGroup.link && (
                <a
                  href={selectedGroup.link}
                  className="text-sm text-primary hover:underline mt-1 block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedGroup.link}
                </a>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Teachers</h3>
              <div className="space-y-2">
                {selectedGroup.teachers?.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={teacher.avatar} alt={teacher.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{teacher.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedGroup.resources && selectedGroup.resources.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Resources</h3>
                <div className="space-y-2">
                  {selectedGroup.resources.map((resource) => (
                    <Card key={resource.id} className="p-2">
                      <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden mb-2">
                          <img
                            src={resource.thumbnail || "/placeholder.svg"}
                            alt={resource.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="w-full">
                          <p className="text-sm font-medium truncate">
                            {resource.name}
                          </p>
                          <div className="flex justify-between mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              <span className="text-xs">Open</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              <span className="text-xs">Download</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
