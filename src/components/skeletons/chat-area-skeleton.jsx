import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Paperclip, Send } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ChatAreaSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4 flex justify-between items-center">
        <div>
          <Skeleton className="h-7 w-48" />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col h-full">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="mt-2 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <div className="flex-1 relative">
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <Button variant="ghost" size="icon" disabled>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 border-l bg-muted/20 p-4 overflow-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <Skeleton className="h-4 w-40 mt-2" />
            </div>

            <div>
              <h3 className="font-medium mb-2">Teachers</h3>
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Resources</h3>
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} className="p-2">
                    <div className="flex flex-col items-center">
                      <Skeleton className="w-full aspect-video rounded-md mb-2" />
                      <div className="w-full">
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between mt-2">
                          <Skeleton className="h-8 w-16 rounded-md" />
                          <Skeleton className="h-8 w-20 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
