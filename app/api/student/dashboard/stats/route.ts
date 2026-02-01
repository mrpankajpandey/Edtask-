import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"

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

    const [enrolledAssignments, availableAssignments] = await Promise.all([
      Assignment.find({
        "enrolledStudents.student": session.user.id,
      }).lean(),
      Assignment.countDocuments({
        "enrolledStudents.student": { $ne: session.user.id },
      
      }),
    ])

    const notSubmitted = enrolledAssignments.filter((a: any) => {
      const enrollment = a.enrolledStudents.find(
        (e: any) => e.student.toString() === session.user.id
      )
      return enrollment?.submissionStatus === "NOT_SUBMITTED"
    }).length

    const submitted = enrolledAssignments.filter((a: any) => {
      const enrollment = a.enrolledStudents.find(
        (e: any) => e.student.toString() === session.user.id
      )
      return enrollment?.submissionStatus === "SUBMITTED"
    }).length

    return NextResponse.json({
      success: true,
      data: {
        totalEnrolled: enrolledAssignments.length,
        availableAssignments,
        notSubmitted,
        submitted,
      },
    })
  } catch (error: any) {
    console.error("Error fetching student stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 }
    )
  }
}