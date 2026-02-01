"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-8xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-xl font-semibold tracking-tight">
              Page Not Found
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>

          <h2 className="text-3xl font-bold mb-2">404 - Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>

          <Link href="/">
            <Button
              size="lg"
              className="rounded-2xl shadow-sm hover:shadow-md transition"
            >
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}