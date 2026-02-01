"use client"

import { useState, useEffect } from "react"
import { BookOpen, ClipboardCheck, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailableAssignments } from "@/components/student/AvailableAssignments"
import { MyAssignments } from "@/components/student/MyAssignments"
import { toast } from "sonner"

interface StudentStats {
  totalEnrolled: number
  availableAssignments: number
  notSubmitted: number
  submitted: number
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/student/dashboard/stats")
      const data = await res.json()

      if (data.success) {
        setStats(data.data)
      } else {
        toast.error("Failed to fetch dashboard stats")
      }
    } catch {
      toast.error("Failed to fetch dashboard stats")
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Available Assignments",
      value: stats?.availableAssignments || 0,
      icon: BookOpen,
      description: "Ready to enroll",
      color: "text-blue-600",
    },
    {
      title: "My Assignments",
      value: stats?.totalEnrolled || 0,
      icon: ClipboardCheck,
      description: "Total enrolled",
      color: "text-purple-600",
    },
    {
      title: "Pending Submissions",
      value: stats?.notSubmitted || 0,
      icon: TrendingUp,
      description: "Need to submit",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="w-full">
      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Student Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your assignments and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="available">
              Available Assignments
            </TabsTrigger>
            <TabsTrigger value="enrolled">
              My Assignments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <AvailableAssignments onEnrollSuccess={fetchStats} />
          </TabsContent>

          <TabsContent value="enrolled">
            <MyAssignments onSubmitSuccess={fetchStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
