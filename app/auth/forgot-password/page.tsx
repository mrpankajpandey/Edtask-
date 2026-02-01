"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Mail, Lock, Hash, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function ForgotPassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams?.get("email");
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: decodeURIComponent(emailParam) }));
    }
  }, [searchParams]);

  // countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // STEP 1 — SEND OTP
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/user/forgot-password/send-otp",
        {
          email: form.email,
        }
      );

      toast.success(res.data.message);
      setStep(2);
      setCountdown(600);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to send OTP"
      );
    }

    setIsLoading(false);
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/user/forgot-password/resend-otp",
        {
          email: form.email,
        }
      );

      toast.success(res.data.message);
      setCountdown(600);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to resend OTP"
      );
    }

    setIsLoading(false);
  };

  // STEP 2 — RESET PASSWORD
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "/api/user/forgot-password/reset",
        {
          email: form.email,
          otp: form.otp,
          password: form.newPassword,
        }
      );

      toast.success(res.data.message);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to reset password"
      );
    }

    setIsLoading(false);
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Enter your email to receive OTP"
              : "Enter OTP and new password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Label>OTP</Label>
              <Input
                value={form.otp}
                onChange={(e) =>
                  setForm({ ...form, otp: e.target.value })
                }
                required
              />

              <div className="text-sm text-muted-foreground">
                OTP expires in {formatTime(countdown)}
              </div>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className="text-sm underline"
              >
                Resend OTP
              </button>

              <Label>New Password</Label>
              <Input
                type="password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                required
              />

              <Button className="w-full" disabled={isLoading}>
                Reset Password
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </form>
          )}
        </CardContent>

        <div className="text-center text-sm pb-4">
          <Link href="/auth/signin">Back to Signin</Link>
        </div>
      </Card>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}
