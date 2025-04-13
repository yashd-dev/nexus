"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm({ className, role = "student", ...props }) {
  const isTeacher = role === "teacher"
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/chat")
    }
  }, [user, router])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }

    if (apiError) {
      setApiError("")
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (password) => {
    if (!password) return "Password is required"
    return ""
  }

  const validateForm = () => {
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    setErrors({
      email: emailError,
      password: passwordError,
    })

    return !emailError && !passwordError
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setApiError("")

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        throw new Error(error.message || "Invalid credentials")
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      router.push("/chat")
    } catch (error) {
      setApiError(error.message)
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBlur = (e) => {
    const { id, value } = e.target
    let error = ""

    switch (id) {
      case "email":
        error = validateEmail(value)
        break
      case "password":
        error = validatePassword(value)
        break
      default:
        break
    }

    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="inline-block px-4 py-1.5 mb-2 text-sm font-medium rounded-full bg-primary/10 text-primary">
                  {isTeacher ? "TEACHER" : "STUDENT"}
                </div>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your {isTeacher ? "educator" : "student"} account
                </p>
              </div>
              {apiError && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{apiError}</div>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email ? "border-red-500" : ""}
                  required
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password ? "border-red-500" : ""}
                  required
                  disabled={isSubmitting}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href={`/signup?role=${role}`} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={
                isTeacher
                  ? "https://cloudinary.hbs.edu/hbsit/image/fetch/q_auto,c_fill,ar_2400:1256/f_webp/https%3A%2F%2Fimages.ctfassets.net%2Fbeh2ph2tgbqk%2F601897GbpNqmLDWLO3Ig2%2F094fc95c88206f7e611c4db56f4ecb71%2F4.3.35.1-classroom-131204-NK-2400x1256.jpg"
                  : "https://hls.harvard.edu/wp-content/uploads/2022/08/DSC7576.jpg"
              }
              alt={isTeacher ? "Teacher illustration" : "Student illustration"}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="/tos">Terms of Service</a> and{" "}
        <a href="/policy">Privacy Policy</a>.
      </div>
    </div>
  )
}
