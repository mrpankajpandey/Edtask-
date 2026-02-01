
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">


      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-muted/40 to-background">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Manage Assignments Smarter with EduTask
        </h1>

        <p className="mt-4 max-w-xl text-muted-foreground">
          EduTask helps students track assignments, meet deadlines,
          and stay productive with a clean and simple workflow.
        </p>

        <div className="mt-8 flex gap-4">
          <Link href="/auth/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="container mx-auto px-6 py-20 grid gap-10 md:grid-cols-3"
      >
        <div className="rounded-xl border p-6">
          <h3 className="font-semibold text-lg">Assignment Tracking</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create, update, and manage assignments with deadlines.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold text-lg">Secure Authentication</h3>
          <p className="text-sm text-muted-foreground mt-2">
            OTP verification, password reset, and Google login support.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold text-lg">Smart Dashboard</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Get a clear overview of your tasks and progress.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/40 py-16 text-center px-6">
        <h2 className="text-3xl font-bold">
          Start Organizing Your Study Today
        </h2>
        <p className="mt-3 text-muted-foreground">
          Built for students. Designed for productivity.
        </p>

        <Link href="/auth/signup">
          <Button size="lg" className="mt-6">
            Create Free Account
          </Button>
        </Link>
      </section>
    </div>
  )
}
