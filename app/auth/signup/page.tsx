"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
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
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { userRoles } from "@/enums/Roles";


export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session?.user?.role) return;
    if (session?.user?.role === "ADMIN") router.push("/admin");
    else router.push("/student");
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("/api/user/signup", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      toast.success(
        res.data.message || "Signup successful! Please verify your email."
      );

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(form.email)}`
      );
    } catch (err: any) {
      console.error(err);

      const apiError = err?.response?.data;

      // ✅ ZOD FIELD ERRORS
      if (apiError?.errors) {
        (Object.values(apiError.errors) as string[][])
          .flat()
          .forEach((msg) => toast.error(msg));

      } else {
        toast.error(
          apiError?.message ||
          apiError?.error ||
          "Signup failed. Please try again."
        );
      }
    }

    setIsLoading(false);
  };


  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    await signIn("google", {
      callbackUrl: "/",
    });
  };
  const handleGuestLogin = async (role: userRoles) => {

    try {
      setIsLoading(true);

      const credentials =
        role === userRoles.ADMIN
          ? { email: "admin@gmail.com", password: "admin@gmail.com" }
          : { email: "student@gmail.com", password: "student@gmail.com" };

      const res = await signIn("credentials", {
        redirect: false,
        ...credentials,
      });

      if (res?.error) {
        toast.error("Guest login failed");
        setIsLoading(false);
        return;
      }

      toast.success(`Logged in as Guest ${role === userRoles.ADMIN ? "ADMIN" : "STUDNET"}`);
      setIsLoading(false);
     } catch (err: any) {
      console.error(err);

      const apiError = err?.response?.data;

      // ✅ ZOD FIELD ERRORS
      if (apiError?.errors) {
        (Object.values(apiError.errors) as string[][])
          .flat()
          .forEach((msg) => toast.error(msg));

      } else {
        toast.error(
          apiError?.message ||
          apiError?.error ||
          "Signup failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/10 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Sign up to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                placeholder="+1234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
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
              {isLoading ? "Creating Account..." : "Sign Up"}
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
          <div className="mt-4 grid gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              onClick={() => handleGuestLogin(userRoles.ADMIN)}
            >
              Login as Guest Admin
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              onClick={() => handleGuestLogin(userRoles.STUDENT)}
            >
              Login as Guest Student
            </Button>
          </div>

        </CardContent>

        <CardFooter className="flex flex-col text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
