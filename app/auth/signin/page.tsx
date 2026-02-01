"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();


  useEffect(() => {
    if (searchParams?.get("verified") === "true") {
      toast.success("Email verified successfully! Please sign in.");
    }
    if (searchParams?.get("registered") === "true") {
      toast.success("Registration completed! Please log in.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!session?.user?.role) return;
    else router.push("/");
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required");
      setIsLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (!res) {
      toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }

    if (res.error) {
      switch (res.error) {
        case "User is not verified":
          toast.error("Email not verified. Redirecting...");
          setTimeout(() => {
            router.push(`/auth/verify-email?email=${form.email}`);
          }, 1500);
          break;

        case "Invalid credentials":
          toast.error("Invalid email or password");
          break;

        case "User not found":
          toast.error("User not found");
          break;

        default:
          toast.error(res.error);
      }

      setIsLoading(false);
      return;
    }

    toast.success("Login successful!");
    router.push("/dashboard");
    setIsLoading(false);
  };


  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/10 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome Back 👋
          </CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href={`/auth/forgot-password?email=${encodeURIComponent(
                    form.email
                  )}`}
                  className="text-sm text-primary hover:underline"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-primary-foreground/20"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center gap-2 my-6">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            variant="outline"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={18}
              height={18}
            />
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="text-center flex flex-col">
          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />;
    </Suspense>
  );
}
