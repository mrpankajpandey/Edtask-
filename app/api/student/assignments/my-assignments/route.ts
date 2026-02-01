import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"

// GET - Get student's enrolled assignments
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== userRoles.STUDENT) {
      return NextResponse.json(
        { error: "Unauthorized - Student access required" },
        { status: 401 }
      )
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const submissionStatus = searchParams.get("submissionStatus")

    const query: any = {
      "enrolledStudents.student": session.user.id,
    }

    const assignments = await Assignment.find(query)
      .sort({ dueDate: 1 })
      .lean()

    // Filter and map to get student's specific enrollment info
    const myAssignments = assignments.map((assignment: any) => {
      const enrollment = assignment.enrolledStudents.find(
        (e: any) => e.student.toString() === session.user.id
      )

      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        status: assignment.status,
        enrolledAt: enrollment.enrolledAt,
        submissionStatus: enrollment.submissionStatus,
        submittedAt: enrollment.submittedAt,

      }
    })

    // Apply submission status filter if provided
    const filteredAssignments = submissionStatus
      ? myAssignments.filter((a) => a.submissionStatus === submissionStatus)
      : myAssignments

    return NextResponse.json({
      success: true,
      data: filteredAssignments,
    })
  } catch (error: any) {
    console.error("Error fetching my assignments:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments", details: error.message },
      { status: 500 }
    )
  }
}