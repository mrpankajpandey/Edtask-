"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentsTable } from "@/components/admin/dashboard/StudentsTable"
import { AssignmentsOverview } from "@/components/admin/dashboard/AssignmentsOverview"
import { EnrollmentsTable } from "@/components/admin/dashboard/EnrollmentsTable"
import { toast } from "sonner"

interface DashboardStats {
  totalStudents: number
  totalAssignments: number
  pendingAssignments: number
  completedAssignments: number
  totalEnrollments: number
  recentStudents: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/dashboard/stats")
      const data = await response.json()

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
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      description: "Registered students",
      color: "text-blue-600",
    },
    {
      title: "Total Assignments",
      value: stats?.totalAssignments || 0,
      icon: BookOpen,
      description: "All assignments",
      color: "text-purple-600",
    },
    {
      title: "Pending Assignments",
      value: stats?.pendingAssignments || 0,
      icon: ClipboardList,
      description: "Awaiting completion",
      color: "text-orange-600",
    },
    {
      title: "Total Enrollments",
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      description: "Student enrollments",
      color: "text-green-600",
    },
  ]

  return (
    <div className="w-full">
      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Heading */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of students and assignments
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
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentsTable />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsOverview />
          </TabsContent>

          <TabsContent value="enrollments">
            <EnrollmentsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
