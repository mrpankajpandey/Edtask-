"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, BookOpen, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format, isPast } from "date-fns"
import axios from "axios"

interface Assignment {
  _id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: string
  createdAt: string
  isExpired: boolean
}

export function AvailableAssignments({ onEnrollSuccess }: { onEnrollSuccess: () => void }) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [showExpired, setShowExpired] = useState(true)
  const [enrollingId, setEnrollingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchAssignments()
  }, [subjectFilter, showExpired])


  const fetchAssignments = async () => {
    try {
      setLoading(true)

      const params: any = {}
      if (subjectFilter !== "all") params.subject = subjectFilter
      params.includeExpired = showExpired

      const { data } = await axios.get(
        "/api/student/assignments/available",
        { params }
      )

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

  const handleEnroll = async (assignmentId: string, isExpired: boolean) => {
    if (isExpired) {
      toast.error("This assignment's due date has passed")
      return
    }

    try {
      setEnrollingId(assignmentId)

      const { data } = await axios.post(
        `/api/student/assignments/${assignmentId}/enroll`
      )

      if (data.success) {
        toast.success("Successfully enrolled in assignment")
        fetchAssignments()
        onEnrollSuccess()
      } else {
        toast.error(data.error || "Failed to enroll")
      }
    } catch (error) {
      toast.error("Failed to enroll in assignment")
    } finally {
      setEnrollingId(null)
    }
  }


  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const subjects = [...new Set(assignments.map((a) => a.subject))]

  // Separate active and expired assignments
  const activeAssignments = filteredAssignments.filter(a => !a.isExpired)
  const expiredAssignments = filteredAssignments.filter(a => a.isExpired)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Assignments</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showExpired"
              checked={showExpired}
              onCheckedChange={(checked: any) => setShowExpired(checked as boolean)}
            />
            <Label htmlFor="showExpired" className="text-sm cursor-pointer">
              Show expired assignments
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No available assignments found
            </div>
          ) : (
            <>
              {/* Active Assignments */}
              {activeAssignments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Assignments</h3>
                  <div className="grid gap-4">
                    {activeAssignments.map((assignment) => (
                      <Card key={assignment._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                <Badge variant="secondary">{assignment.subject}</Badge>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {assignment.description}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Due: {format(new Date(assignment.dueDate), "PPP")}</span>
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleEnroll(assignment._id, assignment.isExpired)}
                              disabled={enrollingId === assignment._id}
                            >
                              {enrollingId === assignment._id ? "Enrolling..." : "Enroll"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Expired Assignments */}
              {showExpired && expiredAssignments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Expired Assignments
                    </h3>
                    <Badge variant="destructive">Past Due Date</Badge>
                  </div>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      These assignments have passed their due date. Enrollment is not available.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 opacity-60">
                    {expiredAssignments.map((assignment) => (
                      <Card key={assignment._id} className="border-destructive/50">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                <div className="flex gap-2">
                                  <Badge variant="secondary">{assignment.subject}</Badge>
                                  <Badge variant="destructive">Expired</Badge>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {assignment.description}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-destructive font-medium">
                                    Due: {format(new Date(assignment.dueDate), "PPP")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Button disabled variant="outline">
                              Cannot Enroll
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}