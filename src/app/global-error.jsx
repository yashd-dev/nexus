"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-destructive/20 to-destructive/40 blur-lg" />
              <div className="relative bg-background rounded-full p-6">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Something went wrong
            </h1>

            <p className="text-muted-foreground mb-8">
              We're sorry, but something unexpected happened. Our team has been
              notified and is working to fix the issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button onClick={() => reset()} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
