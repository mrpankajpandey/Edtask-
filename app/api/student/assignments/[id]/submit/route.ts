import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"
import mongoose from "mongoose"

// POST - Submit an assignment
export async function POST(
   req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== userRoles.STUDENT) {
      return NextResponse.json(
        { error: "Unauthorized - Student access required" },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid assignment ID" },
        { status: 400 }
      )
    }

    await dbConnect()

    const assignment = await Assignment.findById(id)

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    // Find student's enrollment
    const enrollmentIndex = assignment.enrolledStudents.findIndex(
      (e: any) => e.student.toString() === session.user.id
    )

    if (enrollmentIndex === -1) {
      return NextResponse.json(
        { error: "You are not enrolled in this assignment" },
        { status: 400 }
      )
    }

    // Check if already submitted
    if (assignment.enrolledStudents[enrollmentIndex].submissionStatus === "SUBMITTED" ){
      return NextResponse.json(
        { error: "Assignment already submitted" },
        { status: 400 }
      )
    }

    // Update submission status
    assignment.enrolledStudents[enrollmentIndex].submissionStatus = "SUBMITTED"
    assignment.enrolledStudents[enrollmentIndex].submittedAt = new Date()

    await assignment.save()

    return NextResponse.json({
      success: true,
      message: "Assignment submitted successfully",
    })
  } catch (error: any) {
    console.error("Error submitting assignment:", error)
    return NextResponse.json(
      { error: "Failed to submit assignment", details: error.message },
      { status: 500 }
    )
  }
}