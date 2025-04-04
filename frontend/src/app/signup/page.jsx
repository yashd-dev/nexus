import { SignupForm } from "@/components/signup-form"
import { redirect } from "next/navigation"

export default async function SignupPage({ searchParams }) {
  const role = await searchParams?.role

  // Redirect to landing page if no role is specified
  if (!role) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center font-sans p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm role={role} />
      </div>
    </div>
  )
}

