"use client"

import { useState, useEffect } from "react"
import { BookOpen, ClipboardCheck, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailableAssignments } from "@/components/student/AvailableAssignments"
import { MyAssignments } from "@/components/student/MyAssignments"
import {toast} from 'sonner'

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
      const response = await fetch("/api/student/dashboard/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        toast.error( "Failed to fetch dashboard stats",
       )
      }
    } catch (error) {
       toast.error( "Failed to fetch dashboard stats",
       )
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
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your assignments and track your progress
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
                {loading ? "..." : `${stat.value}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Assignments</TabsTrigger>
          <TabsTrigger value="enrolled">My Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <AvailableAssignments onEnrollSuccess={fetchStats} />
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-4">
          <MyAssignments onSubmitSuccess={fetchStats} />
        </TabsContent>
      </Tabs>
    </div>
  )
}