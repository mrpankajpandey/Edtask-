import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"
import mongoose from "mongoose"

// POST - Enroll in an assignment
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

    // Check if already enrolled
    const alreadyEnrolled = assignment.enrolledStudents?.some(
      (e: any) => e.student.toString() === session.user.id
    )

    if (alreadyEnrolled) {
      return NextResponse.json(
        { error: "Already enrolled in this assignment" },
        { status: 400 }
      )
    }

    // Check if due date has passed - still prevent enrollment
    const isPastDue = new Date(assignment.dueDate) < new Date()
    if (isPastDue) {
      return NextResponse.json(
        { 
          error: "Cannot enroll - assignment due date has passed",
          isPastDue: true 
        },
        { status: 400 }
      )
    }

    // Add student to enrolled students
    assignment.enrolledStudents.push({
      student: session.user.id,
      enrolledAt: new Date(),
      submissionStatus: "NOT_SUBMITTED",
    })

    await assignment.save()

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in assignment",
    })
  } catch (error: any) {
    console.error("Error enrolling in assignment:", error)
    return NextResponse.json(
      { error: "Failed to enroll in assignment", details: error.message },
      { status: 500 }
    )
  }
}