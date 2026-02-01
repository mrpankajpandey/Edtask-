"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, BookOpen, CheckCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner'
import axios from "axios"
import { format } from "date-fns"

interface AssignmentDetails {
    _id: string
    title: string
    description: string
    subject: string
    dueDate: string
    status: string
    isEnrolled: boolean
    enrollment: {
        enrolledAt: string
        submissionStatus: "NOT_SUBMITTED" | "SUBMITTED"
        submittedAt?: string
    } | null
}

export default function AssignmentDetailPage() {
    const params = useParams<{ id: string }>()
    const assignmentId = params?.id
    const [assignment, setAssignment] = useState<AssignmentDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!assignmentId) return
        fetchAssignment()
    }, [assignmentId])



    const fetchAssignment = async () => {
        try {
            setLoading(true)

            const { data } = await axios.get(
                `/api/student/assignments/${assignmentId}`
            )

            if (data.success) {
                setAssignment(data.data)
            } else {
                toast.error("Failed to fetch assignment")
                router.push("/student")
            }
        } catch (error) {
            toast.error("Failed to fetch assignment")
            router.push("/student")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setSubmitting(true)

            const { data } = await axios.post(
                `/api/student/assignments/${assignmentId}/submit`
            )

            if (data.success) {
                toast.success("Assignment submitted successfully")
                fetchAssignment()
            } else {
                toast.error("Failed to submit")
            }
        } catch (error) {
            toast.error("Failed to submit assignment")
        } finally {
            setSubmitting(false)
        }
    }


    if (loading) {
        return (
            <div className="container mx-auto py-6">
                <div className="text-center py-20">Loading...</div>
            </div>
        )
    }

    if (!assignment) {
        return null
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                            <div className="flex gap-2">
                                <Badge variant="outline">{assignment.subject}</Badge>
                                {assignment.enrollment && (
                                    <Badge>
                                        {assignment.enrollment.submissionStatus.replace("_", " ")}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {assignment.description}
                        </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Due Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(assignment.dueDate), "PPP")}
                                    </p>
                                </div>
                            </div>

                            {assignment.enrollment?.enrolledAt && (
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Enrolled On</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(assignment.enrollment.enrolledAt), "PPP")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {assignment.enrollment?.submittedAt && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium">Submitted On</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(assignment.enrollment.submittedAt), "PPP")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {assignment.isEnrolled &&
                        assignment.enrollment?.submissionStatus === "NOT_SUBMITTED" && (
                            <>
                                <Separator />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        size="lg"
                                    >
                                        {submitting ? "Submitting..." : "Submit Assignment"}
                                    </Button>
                                </div>
                            </>
                        )}
                </CardContent>
            </Card>
        </div>
    )
}