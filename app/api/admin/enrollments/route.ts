import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== userRoles.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    await dbConnect()

    const assignments = await Assignment.find()
      .populate("enrolledStudents.student", "name email")
      .select("title subject dueDate status enrolledStudents")
      .sort({ createdAt: -1 })
      .lean()

    const enrollments = assignments.flatMap((assignment) =>
      (assignment.enrolledStudents || []).map((enrollment: any) => ({
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        studentId: enrollment.student?._id,
        studentName: enrollment.student?.name,
        studentEmail: enrollment.student?.email,
        enrolledAt: enrollment.enrolledAt,
        submissionStatus: enrollment.submissionStatus,
        submittedAt: enrollment.submittedAt,
      }))
    )

    return NextResponse.json({
      success: true,
      data: enrollments,
    })
  } catch (error: any) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json(
      { error: "Failed to fetch enrollments", details: error.message },
      { status: 500 }
    )
  }
}