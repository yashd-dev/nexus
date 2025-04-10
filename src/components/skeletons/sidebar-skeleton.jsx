import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, Hash, Plus, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SidebarSkeleton() {
  return (
    <div className="border-r w-64 flex-shrink-0">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 text-primary-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 px-4 text-xs uppercase font-medium text-muted-foreground">
              <span>Your Groups</span>
              <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {Array.from({ length: 2 }).map((_, yearIndex) => (
                <div key={yearIndex}>
                  <div className="w-full px-4 py-2">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  {yearIndex === 0 && (
                    <div className="ml-4 space-y-1">
                      {Array.from({ length: 2 }).map((_, semesterIndex) => (
                        <div key={semesterIndex}>
                          <div className="w-full px-4 py-2">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                          {semesterIndex === 0 && (
                            <div className="ml-4 space-y-1">
                              {Array.from({ length: 3 }).map((_, divisionIndex) => (
                                <div key={divisionIndex} className="w-full px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <Skeleton className="h-4 w-28" />
                                  </div>
                                </div>
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
              <div className="w-full px-4 py-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}