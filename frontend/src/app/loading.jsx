import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <h2 className=" font-medium">Loading..</h2>
        <p className="text-muted-foreground text-sm">This won't take long</p>
      </div>
    </div>
  );
}
