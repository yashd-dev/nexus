"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Users, MessageSquare, Clock, Shield } from "lucide-react";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role") || "student";
  const [name, setName] = useState("there");
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [joinGroupOpen, setJoinGroupOpen] = useState(false);
  const [outOfOfficeEnabled, setOutOfOfficeEnabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [generatedInviteLink, setGeneratedInviteLink] = useState("");
  const { toast } = useToast();

  // Simulate fetching user data
  useEffect(() => {
    // This would be replaced with actual API call to get user data
    const mockUserData = {
      name: role === "teacher" ? "Ms. Johnson" : "Alex",
    };
    setName(mockUserData.name);
  }, [role]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    // Generate a mock invite link
    const mockInviteLink = `app.classroom.ai/join/${Math.random()
      .toString(36)
      .substring(2, 10)}`;
    setGeneratedInviteLink(mockInviteLink);
    // In a real app, you would save the group to the database here
  };

  const handleJoinGroup = (e) => {
    e.preventDefault();
    // In a real app, you would validate the invite link and join the group
    setJoinGroupOpen(false);
    router.push("/chat");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Progress indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-8 ${
                currentStep >= 2 ? "bg-primary" : "bg-muted"
              }`}
            ></div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-8 ${
                currentStep >= 3 ? "bg-primary" : "bg-muted"
              }`}
            ></div>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
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

      {/* Main content */}
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
            <div className="border  border-muted"></div>

            <div className="p-8">
              {/* Teacher onboarding */}
              {role === "teacher" && (
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">
                          Create Your First Group
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Create a classroom group and share the invite link with
                        your students to get started.
                      </p>
                      <Button
                        onClick={() => setCreateGroupOpen(true)}
                        className="w-full md:w-auto"
                      >
                        Create Group <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">
                          Out-of-Office Mode
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Enable AI assistance to answer student questions when
                        you're unavailable.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="out-of-office"
                          checked={outOfOfficeEnabled}
                          onCheckedChange={setOutOfOfficeEnabled}
                        />
                        <Label htmlFor="out-of-office">
                          {outOfOfficeEnabled ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      Privacy & AI Assistant
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI assistant helps answer common questions when you're
                      unavailable. You maintain full control over when it's
                      active, and can review all interactions. Student data is
                      always protected and never used for training AI models.
                    </p>
                  </div>
                </div>
              )}

              {/* Student onboarding */}
              {role === "student" && (
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">
                          Join Your Classroom
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Use the invite link from your teacher to join your
                        classroom group instantly.
                      </p>
                      <Button
                        onClick={() => setJoinGroupOpen(true)}
                        className="w-full md:w-auto"
                      >
                        Join Group <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">
                          Start Learning
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Ask questions directly to your teacher or get help from
                        the AI assistant when they're away.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/chat")}
                        className="w-full md:w-auto"
                      >
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
                      Ask questions anytime! Your teacher will respond when
                      available. When your teacher enables Out-of-Office mode,
                      our AI assistant can help with immediate answers to common
                      questions. Your privacy is always protected.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <div className="grid gap-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="e.g., Math 101 - Spring 2025"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              {generatedInviteLink && (
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="invite-link">Invite Link</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invite-link"
                      value={generatedInviteLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedInviteLink);
                        toast({
                          title: "Invite link copied to clipboard",
                          description:
                            "Share this link with your students to invite them to your group.",
                        });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this link with your students to invite them to your
                    group.
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
                    setCreateGroupOpen(false);
                    router.push("/dashboard");
                  }}
                >
                  Continue to Dashboard
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Join Group Dialog */}
      <Dialog open={joinGroupOpen} onOpenChange={setJoinGroupOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join a Group</DialogTitle>
            <DialogDescription>
              Enter the invite link or code provided by your teacher.
            </DialogDescription>
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
                      placeholder="https://app.classroom.ai/join/abc123"
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      required
                    />
                  </div>
                </TabsContent>
                <TabsContent value="code" className="mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="invite-code">Invite Code</Label>
                    <Input id="invite-code" placeholder="ABC123" required />
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
  );
}
