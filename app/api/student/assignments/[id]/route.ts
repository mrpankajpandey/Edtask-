import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"
import mongoose from "mongoose"

// GET - Get single assignment details
export async function GET(
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

    const assignment = await Assignment.findById(id).lean()

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    // Check if student is enrolled
    const enrollment = assignment.enrolledStudents?.find(
      (e: any) => e.student.toString() === session.user.id
    )

    const response = {
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      status: assignment.status,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error: any) {
    console.error("Error fetching assignment:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignment", details: error.message },
      { status: 500 }
    )
  }
}