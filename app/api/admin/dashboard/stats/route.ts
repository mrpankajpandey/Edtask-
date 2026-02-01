import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import User from "@/models/User"
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

    const [
      totalStudents,
      totalAssignments,
      pendingAssignments,
      completedAssignments,
      recentStudents,
    ] = await Promise.all([
      User.countDocuments({ role: userRoles.STUDENT }),
      Assignment.countDocuments(),
      Assignment.countDocuments({ status: "PENDING" }),
      Assignment.countDocuments({ status: "COMPLETED" }),
      User.find({ role: userRoles.STUDENT })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt isVerified")
        .lean(),
    ])

    // Calculate total enrollments
    const assignments = await Assignment.find().select("enrolledStudents").lean()
    const totalEnrollments = assignments.reduce(
      (sum, assignment) => sum + (assignment.enrolledStudents?.length || 0),
      0
    )

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalAssignments,
        pendingAssignments,
        completedAssignments,
        totalEnrollments,
        recentStudents,
      },
    })
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: error.message },
      { status: 500 }
    )
  }
}