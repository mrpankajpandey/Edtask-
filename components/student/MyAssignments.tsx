"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CheckCircle, Clock, Award } from "lucide-react"
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
import { format } from "date-fns"
import { toast } from 'sonner'
import axios from "axios"
interface MyAssignment {
    _id: string
    title: string
    description: string
    subject: string
    dueDate: string
    status: string
    enrolledAt: string
    submissionStatus: "NOT_SUBMITTED" | "SUBMITTED"
    submittedAt?: string
}

export function MyAssignments({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
    const [assignments, setAssignments] = useState<MyAssignment[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("all")
    const router = useRouter()

    useEffect(() => {
        fetchAssignments()
    }, [statusFilter])

    const fetchAssignments = async () => {
        try {
            setLoading(true)

            const params: any = {}
            if (statusFilter !== "all") {
                params.submissionStatus = statusFilter
            }

            const { data } = await axios.get(
                "/api/student/assignments/my-assignments",
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

    const handleSubmit = async (assignmentId: string) => {
        try {
            const { data } = await axios.post(
                `/api/student/assignments/${assignmentId}/submit`
            )

            if (data.success) {
                toast.success("Assignment submitted successfully")
                fetchAssignments()
                onSubmitSuccess()
            } else {
                toast.error("Failed to submit")
            }
        } catch (error) {
            toast.error("Failed to submit")
        }
    }


    const getStatusBadge = (status: string) => {
        const config = {
            NOT_SUBMITTED: { variant: "secondary" as const, label: "Not Submitted", icon: Clock },
            SUBMITTED: { variant: "default" as const, label: "Submitted", icon: CheckCircle },
        }

        const { variant, label, icon: Icon } = config[status as keyof typeof config] || config.NOT_SUBMITTED

        return (
            <Badge variant={variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {label}
            </Badge>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>My Assignments</CardTitle>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="NOT_SUBMITTED">Not Submitted</SelectItem>
                            <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : assignments.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No assignments found
                        </div>
                    ) : (
                        assignments.map((assignment) => (
                            <Card key={assignment._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                                                    <div className="flex gap-2">
                                                        <Badge variant="outline">{assignment.subject}</Badge>
                                                        {getStatusBadge(assignment.submissionStatus)}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {assignment.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Due: {format(new Date(assignment.dueDate), "PPP")}</span>
                                                    </div>

                                                    {assignment.submittedAt && (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="h-4 w-4" />
                                                            <span>Submitted: {format(new Date(assignment.submittedAt), "PPP")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {assignment.submissionStatus === "NOT_SUBMITTED" && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => router.push(`/student/assignments/${assignment._id}`)}
                                                    variant="outline"
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    onClick={() => handleSubmit(assignment._id)}
                                                >
                                                    Submit Assignment
                                                </Button>
                                            </div>
                                        )}

                                        {assignment.submissionStatus !== "NOT_SUBMITTED" && (
                                            <Button
                                                onClick={() => router.push(`/student/assignments/${assignment._id}`)}
                                                variant="outline"
                                            >
                                                View Details
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}