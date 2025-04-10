import { SidebarSkeleton } from "./sidebar-skeleton"
import { ChatAreaSkeleton } from "./chat-area-skeleton"

export function MainSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarSkeleton />
      <ChatAreaSkeleton />
    </div>
  )
}
