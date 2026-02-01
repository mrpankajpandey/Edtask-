"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentsTable } from "@/components/admin/dashboard/StudentsTable"
import { AssignmentsOverview } from "@/components/admin/dashboard/AssignmentsOverview"
import { EnrollmentsTable } from "@/components/admin/dashboard/EnrollmentsTable"
import { toast } from 'sonner'
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
        toast.error("Failed to fetch dashboard stats",
        )
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard stats",
      )
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
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of students and assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

      {/* Tabs for different views */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <StudentsTable />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <AssignmentsOverview />
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <EnrollmentsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}