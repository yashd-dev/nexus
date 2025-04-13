// components/sections/chat/chat-area.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Copy,
  Download,
  LinkIcon,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatAreaSkeleton } from "@/components/skeletons/chat-area-skeleton";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRouter } from "next/navigation"; // Import useRouter

export function ChatArea({ selectedGroup }) {
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const currentUserId = user?.["id"];
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false); // Added uploading state

  const router = useRouter(); // Initialize useRouter

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
      setMessages(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (file, groupId, senderId, senderRole) => {
    setUploading(true); // Set uploading to true when file upload starts
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_id", groupId);
      formData.append("sender_id", senderId);
      formData.append("sender_role", senderRole);

      const res = await fetch("http://localhost:5000/api/gemini/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data.error);
        return { success: false, error: data.error };
      }

      console.log("✅ Upload successful:", data.message);
      return { success: true, message: data.message };
    } catch (err) {
      console.error("Upload error:", err);
      return { success: false, error: err.message || "Unknown error occurred" };
    } finally {
      setUploading(false); // Set uploading to false whether upload succeeds or fails
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user["id"];
    const userRole = user["role"];

    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/fetch/${selectedGroup}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      const dat = await res.json();
      setMessages(dat);
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
          embedding: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const responseData = await response.json();
      const messageId = responseData.message_id;

      const message = {
        id: messageId,
        group_id: selectedGroup.id,
        sender_id: userId,
        sender_role: userRole,
        content: newMessage,
        timestamp: new Date().toISOString(),
        sender_name: user.name,
        sender_avatar: "https://thispersondoesnotexist.com/",
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  const handleAvatarClick = async (otherUserId) => {
    if (otherUserId === currentUserId) {
      // Don't do anything if it is yourself.
      return;
    }
    try {
      // 1. Check if a personal group already exists
      const checkResponse = await fetch(
        "http://localhost:5000/api/groups/check-personal-group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUserId,
            other_user_id: otherUserId,
          }),
        }
      );

      if (!checkResponse.ok) {
        throw new Error("Failed to check for existing group");
      }

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        // 2. If group exists, redirect to it
        router.push(`/group/${checkData.group_id}`);
      } else {
        // 3. Fetch semester ID
        let semesterId = null;
        if (selectedGroup) {
          try {
            const semesterResponse = await fetch(
              `http://localhost:5000/api/semesters/${selectedGroup.id}`
            );
            if (!semesterResponse.ok) {
              throw new Error("Failed to fetch semester ID");
            }
            const semesterData = await semesterResponse.json();
            semesterId = semesterData.id; // Assuming your endpoint returns { id: "semester-id", ... }
          } catch (err) {
            console.error("Error fetching semester ID:", err);
            setError(err.message); // Handle the error appropriately
            return; // Exit if semester ID cannot be fetched
          }
        }

        // 4. Create a new one and redirect
        const createResponse = await fetch(
          "http://localhost:5000/api/groups/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: currentUserId, // ID of the user initiating the chat
              other_user_id: otherUserId, // ID of the user whose avatar was clicked
              group_type: "personal",
              subject_name: "Direct Message", // Or some other name
              semester_id: semesterId,
            }),
          }
        );

        if (!createResponse.ok) {
          throw new Error("Failed to create personal group");
        }

        const createData = await createResponse.json();
        const newGroupId = createData.group_id;
        router.push(`/group/${newGroupId}`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error creating/checking personal group:", err);
    }
  };

  if (loading) {
    return <ChatAreaSkeleton />;
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            <p className="font-medium">Error loading messages</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button onClick={() => fetchMessages(selectedGroup.id)}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-2">
              No conversation selected
            </h3>
            <p className="text-muted-foreground">
              Select a group from the sidebar to start chatting
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b py-3 px-4 flex justify-between items-center bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                selectedGroup.avatar || "/placeholder.svg?height=36&width=36"
              }
              alt={selectedGroup.name}
            />
            <AvatarFallback>
              {selectedGroup.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg leading-tight">
              {selectedGroup.name}
            </h1>
            {selectedGroup.teachers /* Display only when teachers exist */ &&
              selectedGroup.teachers.map((teacher) => {
                return teacher.is_available ? (
                  /* Is teacher Online */ <CheckCircle className="inline-block w-3 h-3 ml-1 text-green-500" />
                ) : (
                  /* AI is being online*/

                  <AlertTriangle className="inline-block w-3 h-3 ml-1 text-red-500" />
                );
              })}

            {selectedGroup.members_count && (
              <p className="text-xs text-muted-foreground">
                {selectedGroup.members_count} members
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Group Info</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden md:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col h-full">
          <ScrollArea className="flex-1 px-4 py-6" ref={scrollAreaRef}>
            <div className="space-y-6 max-w-3xl mx-auto">
              {Object.keys(messageGroups).map((date) => (
                <div key={date} className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                      {formatDate(messageGroups[date][0].timestamp)}
                    </div>
                  </div>

                  {messageGroups[date].map((message, index) => {
                    const isCurrentUser = message.sender_id === currentUserId;
                    console.log(message);
                    const showAvatar =
                      index === 0 ||
                      messageGroups[date][index - 1].sender_id !==
                        message.sender_id;

                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2",
                          isCurrentUser ? "justify-end" : "justify-start"
                        )}
                      >
                        {!isCurrentUser && showAvatar ? (
                          <Avatar
                            className="h-8 w-8 mt-1 flex-shrink-0 cursor-pointer"
                            onClick={() => handleAvatarClick(message.sender_id)}
                          >
                            <AvatarImage
                              src={message.sender_avatar}
                              alt={message.sender_name}
                            />
                            <AvatarFallback>
                              {message.sender_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : !isCurrentUser ? (
                          <div className="w-8 flex-shrink-0" />
                        ) : null}

                        <div
                          className={cn(
                            "max-w-[75%]",
                            isCurrentUser ? "order-1" : "order-2"
                          )}
                        >
                          {showAvatar && (
                            <div
                              className={cn(
                                "text-xs mb-1",
                                isCurrentUser ? "text-right" : "text-left"
                              )}
                            >
                              <span className="font-medium">
                                {message.sender_name}
                              </span>
                            </div>
                          )}

                          <div
                            className={cn(
                              "p-3 rounded-lg break-words",
                              isCurrentUser
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                            )}
                          >
                            <p>{message.content}</p>
                            <div
                              className={cn(
                                "text-xs mt-1",
                                isCurrentUser
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>

                        {isCurrentUser && showAvatar ? (
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                            <AvatarImage
                              src={message.sender_avatar}
                              alt={message.sender_name}
                            />
                            <AvatarFallback>
                              {message.sender_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : isCurrentUser ? (
                          <div className="w-8 flex-shrink-0" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}

              {messages.length === 0 && (
                <div className="flex justify-center items-center h-32">
                  <p className="text-muted-foreground text-sm">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 h-16 w-16 cursor-pointer"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach File</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="pr-10 h-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar - Desktop */}
        <div
          className={cn(
            "w-80 border-l bg-background overflow-auto hidden md:block transition-all duration-200",
            sidebarOpen ? "opacity-100" : "w-0 opacity-0"
          )}
        >
          {sidebarOpen && <GroupInfoSidebar selectedGroup={selectedGroup} />}
        </div>

        {/* Info Sidebar - Mobile */}
        <Sheet
          open={sidebarOpen && window.innerWidth < 768}
          onOpenChange={setSidebarOpen}
        >
          <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
            <div className="h-full overflow-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Group Info</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <GroupInfoSidebar selectedGroup={selectedGroup} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function GroupInfoSidebar({ selectedGroup }) {
  return (
    <div className="p-4 space-y-6">
      {/* Group Description */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
          About
        </h3>
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-sm">
            {selectedGroup.description || "No description available"}
          </p>
          {selectedGroup.link && (
            <a
              href={selectedGroup.link}
              className="text-sm text-primary hover:underline mt-2 flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon className="h-3 w-3" />
              <span>View Resource</span>
            </a>
          )}
        </div>
      </div>

      {/* Teachers */}
      {selectedGroup.teachers?.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Teachers
          </h3>
          <div className="space-y-2">
            {selectedGroup.teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback>
                    {teacher.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {selectedGroup.resources && selectedGroup.resources.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Resources
          </h3>
          <div className="grid gap-3">
            {selectedGroup.resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={
                      resource.thumbnail ||
                      "/placeholder.svg?height=120&width=200"
                    }
                    alt={resource.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate mb-2">
                    {resource.name}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-full">
                      <Copy className="h-3 w-3 mr-1" />
                      <span className="text-xs">Open</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-full">
                      <Download className="h-3 w-3 mr-1" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
