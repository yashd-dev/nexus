"use client";
import { use, useEffect, useState } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user != null) {
      window.location.href = "/chat";
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      
      <div className="flex flex-1 flex-col items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-border">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
            TEACHERS
          </div>
          <h2 className="text-3xl font-bold mb-4">For Educators</h2>
          <p className="text-muted-foreground mb-8">
            Create engaging learning experiences, manage your classroom, and
            track student progress with our comprehensive teaching tools.
          </p>

          <div className="space-y-4">
            <Link href="/login?role=teacher" className="w-full">
              <Button variant="default" className="w-full">
                Login
              </Button>
            </Link>

            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                href="/signup?role=teacher"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex flex-1 flex-col items-center justify-center p-8 md:p-12">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
            STUDENTS
          </div>
          <h2 className="text-3xl font-bold mb-4">For Learners</h2>
          <p className="text-muted-foreground mb-8">
            Join millions of students, practice new skills, prepare for exams,
            and achieve your learning goals.
          </p>

          <div className="space-y-4">
            <Link href="/login?role=student" className="w-full">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>

            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link
                href="/signup?role=student"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
