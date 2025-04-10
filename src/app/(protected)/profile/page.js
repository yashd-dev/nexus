"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2,
  Save,
  Edit,
  User,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  Users,
} from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();

  // Mock user data - in a real app, this would come from an API or context
  const [user, setUser] = useState({
    id: "user_123",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "student",
    department: "Computer Science",
    semester: 3,
    avatar: "/placeholder.svg?height=100&width=100",
    createdAt: "2023-09-01",
  });

  // Mock groups data
  const [groups, setGroups] = useState([
    {
      id: "group_1",
      name: "Algorithm Study Group",
      semester: 3,
      members: 8,
      createdAt: "2023-09-15",
    },
    {
      id: "group_2",
      name: "Database Project Team",
      semester: 3,
      members: 5,
      createdAt: "2023-09-20",
    },
    {
      id: "group_3",
      name: "Web Development Workshop",
      semester: 2,
      members: 12,
      createdAt: "2023-03-10",
    },
    {
      id: "group_4",
      name: "AI Research Group",
      semester: 3,
      members: 6,
      createdAt: "2023-10-05",
    },
  ]);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile changes
  const saveChanges = () => {
    setUser(editedUser);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  // Delete group
  const deleteGroup = (groupId) => {
    setGroups(groups.filter((group) => group.id !== groupId));
    toast({
      title: "Group deleted",
      description: "The group has been removed from your profile.",
    });
  };

  return (
    <div className="container max-w-5xl py-10 m-auto ">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="groups">My Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal details and account information
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => {
                  if (isEditing) {
                    saveChanges();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    Full Name
                  </div>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={editedUser.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{user.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Address
                  </div>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{user.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="mr-2 h-4 w-4" />
                    Department
                  </div>
                  {isEditing ? (
                    <Input
                      name="department"
                      value={editedUser.department}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">{user.department}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Current Semester
                  </div>
                  {isEditing ? (
                    <Input
                      name="semester"
                      type="number"
                      value={editedUser.semester}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="font-medium">Semester {user.semester}</div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Account Created
                </div>
                <div className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              {isEditing && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>My Groups</CardTitle>
              <CardDescription>
                Manage your group memberships and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No groups yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    You haven't joined any groups yet. Groups help you
                    collaborate with others on projects and studies.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/groups/browse")}
                  >
                    Browse Groups
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{group.name}</h3>
                          <Badge variant="outline">
                            Semester {group.semester}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{group.members} members</span>
                          <span>
                            Created{" "}
                            {new Date(group.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/groups/${group.id}`)}
                        >
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove you from the group "
                                {group.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteGroup(group.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={() => router.push("/groups/create")}
              >
                Create New Group
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
