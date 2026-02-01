"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'
import { AssignmentDialog } from "@/components/admin/AssignmentDialog"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { format } from "date-fns"
import Link from "next/link"

interface Assignment {
  _id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: "PENDING" | "COMPLETED"
  user: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchAssignments()
  }, [statusFilter, subjectFilter])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (subjectFilter !== "all") params.append("subject", subjectFilter)

      const response = await fetch(`/api/admin/assignments?${params}`)
      const data = await response.json()

      if (data.success) {
        setAssignments(data.data)
      } else {
        toast.error("Failed to fetch assignments",)
      }
    } catch (error) {
      toast.error("Failed to fetch assignments",

      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/assignments/${deleteId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Assignment deleted successfully",
        )
        fetchAssignments()
      } else {
        toast.error(data.error || "Failed to delete assignment")
      }
    } catch (error) {
      toast.error("Failed to delete assignment")
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
    }
  }

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const subjects = [...new Set(assignments.map((a) => a.subject))]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link
          href={'/admin'}
          className="bg-black px-4 py-2 text-white rounded-sm"
        >
          Go Back
        </Link>
        <div>

          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Manage student assignments</p>
        </div>

        <Button onClick={() => {
          setSelectedAssignment(null)
          setIsDialogOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssignments.map((assignment) => (
                  <TableRow key={assignment._id}>
                    <TableCell className="font-medium">
                      {assignment.title}
                    </TableCell>
                    <TableCell>{assignment.subject}</TableCell>
                    <TableCell>
                      {format(new Date(assignment.dueDate), "PPP")}
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
                      {format(new Date(assignment.createdAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedAssignment(assignment)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(assignment._id)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AssignmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        assignment={selectedAssignment}
        onSuccess={fetchAssignments}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Assignment"
        description="Are you sure you want to delete this assignment? This action cannot be undone."
      />
    </div>
  )
}