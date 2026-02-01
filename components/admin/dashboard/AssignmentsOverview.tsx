"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { format } from "date-fns"

interface Assignment {
  _id: string
  title: string
  subject: string
  dueDate: string
  status: "PENDING" | "COMPLETED"
  enrolledStudents?: any[]
  createdAt: string
}

export function AssignmentsOverview() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAssignments()
  }, [])


const fetchAssignments = async () => {
  try {
    setLoading(true)

    const { data } = await axios.get("/api/admin/assignments", {
      params: { limit: 10 },
    })

    if (data.success) {
      setAssignments(data.data)
    } else {
      toast.error("Failed to fetch assignments")
    }
  } catch (error) {
    toast.error("Failed to fetch assignments")
  } finally {
    setLoading(false)
  }
}


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Assignments</CardTitle>
        <Button onClick={() => router.push("/admin/assignments")}>
          <Plus className="mr-2 h-4 w-4" />
          Manage Assignments
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No assignments found
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell className="font-medium">
                    {assignment.title}
                  </TableCell>
                  <TableCell>{assignment.subject}</TableCell>
                  <TableCell>
                    {format(new Date(assignment.dueDate), "PP")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assignment.status === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {assignment.enrolledStudents?.length || 0} students
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(assignment.createdAt), "PP")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}