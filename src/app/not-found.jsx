"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareOff, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 blur-lg" />
          <div className="relative bg-background rounded-full p-6">
            <MessageSquareOff className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Chat Not Found</h2>

        <p className="text-muted-foreground mb-8">
          The chat group or conversation you're looking for doesn't exist or may
          have been moved to a different semester.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button asChild className="flex-1">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-8 opacity-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-16 h-16 rounded-lg bg-primary/10 animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
