"use client";

import Link from "next/link";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnAuthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="border-b bg-card">
        <div className="container max-w-8xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-xl font-semibold tracking-tight">
              Unauthorized Access
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 -mt-60">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <Lock className="w-16 h-16 text-destructive" />
          </div>

          <h2 className="text-3xl font-bold mb-2">401 - Unauthorized</h2>
          <p className="text-muted-foreground mb-8">
            You don&apos;t have permission to view this page. Please log in with
            the appropriate credentials or return to the homepage.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button
                size='lg'
                className="rounded-2xl shadow-sm hover:shadow-md transition"
              >
                Go back home
              </Button>
            </Link>

            <Link href="/auth/signin">
              <Button
                size='lg'
                className="rounded-2xl shadow-sm hover:shadow-md transition"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}