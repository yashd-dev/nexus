"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LoginForm({ className, role = "student", ...props }) {
  const isTeacher = role === "teacher";
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      router.push("/chat");
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    current_role: role,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const newErrors = { ...errors };
          data.errors.forEach((error) => {
            if (error.field && newErrors.hasOwnProperty(error.field)) {
              newErrors[error.field] = error.message;
            }
          });
          setErrors(newErrors);
        }

        throw new Error(data.message || "Invalid credentials");
      }
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("token", data.token);

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name || data.user.email}!`,
      });

      const userRole = data.user.role;
      router.push("/chat");
    } catch (error) {
      setApiError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    let error = "";

    switch (id) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));
  };

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
              {apiError && (
                <div className="p-3 text-sm text-white bg-red-500 rounded-md">
                  {apiError}
                </div>
              )}
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
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="w-full flex justify-center items-center"
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.385-1.334-1.756-1.334-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.304 3.495.997.108-.775.418-1.304.76-1.605-2.665-.304-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.522.105-3.176 0 0 1.005-.322 3.3 1.23a11.493 11.493 0 0 1 3.003-.403c1.02.005 2.045.137 3.003.403 2.292-1.552 3.295-1.23 3.295-1.23.648 1.654.243 2.873.12 3.176.77.84 1.23 1.91 1.23 3.22 0 4.61-2.807 5.623-5.48 5.921.43.372.812 1.103.812 2.222v3.293c0 .322.218.698.825.577 4.765-1.585 8.2-6.082 8.2-11.385 0-6.627-5.373-12-12-12z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with GitHub</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/signup?role=${role}`}
                  className="underline underline-offset-4"
                >
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
        By clicking continue, you agree to our{" "}
        <a href="/tos">Terms of Service</a> and{" "}
        <a href="/policy">Privacy Policy</a>.
      </div>
    </div>
  );
}
