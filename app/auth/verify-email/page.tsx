"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams?.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!otp || otp.length !== 6) {
    toast.error("Please enter a valid 6-digit OTP");
    setIsLoading(false);
    return;
  }

  try {
    const res = await axios.post("/api/user/verify-email", {
      email,
      otp,
    });

    toast.success(res.data.message || "Email verified successfully!");

    setIsVerified(true);

    setTimeout(() => {
      router.push("/auth/signin?verified=true");
    }, 2000);
  } catch (err: any) {
    console.error("Verification error:", err);

    toast.error(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid or expired OTP"
    );
  }

  setIsLoading(false);
};

 const handleResendOTP = async () => {
  if (countdown > 0) return;

  setIsResending(true);

  try {
    const res = await axios.post("/api/user/resend-otp", {
      email,
    });

    toast.success(
      res.data.message || "OTP resent successfully! Please check your email."
    );

    setCountdown(600);
  } catch (err: any) {
    console.error("Resend OTP error:", err);

    toast.error(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to resend OTP"
    );
  }

  setIsResending(false);
};


  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Email Verified!
            </CardTitle>
            <CardDescription>
              Your email has been successfully verified. Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-center">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            We’ve sent a 6-digit verification code to <br />
            <span className="font-semibold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {message && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-green-700 text-sm text-center">{message}</p>
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="otp" className="text-center">
                Enter 6-digit OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  OTP valid for{" "}
                  {countdown > 0 ? formatTime(countdown) : "00:00"}
                </span>
              </div>
              <Button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isResending}
                className={`text-primary hover:underline disabled:text-muted-foreground`}
              >
                {countdown > 0
                  ? `Resend in ${formatTime(countdown)}`
                  : isResending
                    ? "Sending..."
                    : "Resend OTP"}
              </Button>
            </div>

            <Button type="submit" className="w-full border-primary-foreground/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>
        </CardContent>

        <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
          <Link href="/auth/signin" className="text-primary hover:underline">
            Back to Signin
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
