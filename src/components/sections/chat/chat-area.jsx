// components/sections/chat/chat-area.jsx
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

  const [messages, setMessages] = useState([]); // Initialize as an empty array
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/fetch/${groupId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      console.log("Fetched messages:", data);
      setMessages(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    // Get user info from session storage
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user["id"];
    const userRole = user["role"];

    try {
      const response = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: selectedGroup.id,
          sender_id: userId,
          sender_role: userRole,
          content: newMessage,
          embedding: null, // You can implement embeddings later
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Optimistically add the message to the local state
      const message = {
        id: Date.now().toString(), // Temporary ID
        group_id: selectedGroup.id,
        sender_id: userId,
        sender_role: userRole,
        content: newMessage,
        timestamp: new Date().toISOString(), // Or get timestamp from the backend response if available
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");

      // Re-fetch messages to update the UI, or use the response from the server
      fetchMessages(selectedGroup.id);
    } catch (err) {
      setError(err.message);
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.id);
    }
  }, [selectedGroup]);

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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

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
                      src={message.sender_avatar} // Use sender_avatar
                      alt={message.sender_name} 
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.sender_name}</span>{" "}
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString([], {
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
