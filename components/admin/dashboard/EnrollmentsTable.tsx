"use client"

import axios from "axios"
import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { format } from "date-fns"

interface Enrollment {
  assignmentId: string
  assignmentTitle: string
  subject: string
  dueDate: string
  studentId: string
  studentName: string
  studentEmail: string
  enrolledAt: string
  submissionStatus: "NOT_SUBMITTED" | "SUBMITTED"
  submittedAt?: string

}

export function EnrollmentsTable() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchEnrollments()
  }, [])


const fetchEnrollments = async () => {
  try {
    setLoading(true)

    const { data } = await axios.get("/api/admin/enrollments")

    if (data.success) {
      setEnrollments(data.data)
    } else {
      toast.error("Failed to fetch enrollments")
    }
  } catch (error) {
    toast.error("Failed to fetch enrollments")
  } finally {
    setLoading(false)
  }
}

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      NOT_SUBMITTED: "secondary",
      SUBMITTED: "default",
    }

    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Enrollments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No enrollments found
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment, index) => (
                <TableRow key={`${enrollment.assignmentId}-${enrollment.studentId}-${index}`}>
                  <TableCell className="font-medium">
                    {enrollment.assignmentTitle}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enrollment.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {enrollment.studentEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{enrollment.subject}</TableCell>
                  <TableCell>
                    {format(new Date(enrollment.dueDate), "PP")}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(enrollment.submissionStatus)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(enrollment.enrolledAt), "PP")}
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