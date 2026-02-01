"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
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
import { toast } from "sonner"
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
  createdAt: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null)
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

      const res = await fetch(`/api/admin/assignments?${params}`)
      const data = await res.json()

      if (data.success) setAssignments(data.data)
      else toast.error("Failed to fetch assignments")
    } catch {
      toast.error("Failed to fetch assignments")
    } finally {
      setLoading(false)
    }
  }

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const subjects = [...new Set(assignments.map((a) => a.subject))]

  return (
    <div className="w-full">
      {/* CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="inline-block text-sm text-muted-foreground hover:underline"
            >
              ← Back
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Assignments
            </h1>
            <p className="text-muted-foreground">
              Manage student assignments
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedAssignment(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
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

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
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
                    filteredAssignments.map((a) => (
                      <TableRow key={a._id}>
                        <TableCell className="font-medium">
                          {a.title}
                        </TableCell>
                        <TableCell>{a.subject}</TableCell>
                        <TableCell>
                          {format(new Date(a.dueDate), "PPP")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              a.status === "COMPLETED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(a.createdAt), "PP")}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedAssignment(a)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setDeleteId(a._id)
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
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AssignmentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          assignment={selectedAssignment}
          onSuccess={fetchAssignments}
        />

        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => {}}
          title="Delete Assignment"
          description="This action cannot be undone."
        />
      </div>
    </div>
  )
}
