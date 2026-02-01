import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/authOptions"
import dbConnect from "@/lib/db"
import Assignment from "@/models/Assignment"
import { userRoles } from "@/enums/Roles"

// GET - Get all available assignments (not enrolled yet)
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
    const subject = searchParams.get("subject")
    const status = searchParams.get("status")
    const includeExpired = searchParams.get("includeExpired") === "true"

    // Build query - show all assignments not enrolled in
    const query: any = {
      "enrolledStudents.student": { $ne: session.user.id },
    }

    // Optionally filter out expired assignments
    if (!includeExpired) {
      query.dueDate = { $gte: new Date() }
    }

    if (subject) query.subject = subject
    if (status) query.status = status

    const assignments = await Assignment.find(query)
      .sort({ dueDate: 1 })
      .select("title description subject dueDate status createdAt")
      .lean()

    // Add isExpired flag to each assignment
    const assignmentsWithExpiry = assignments.map(assignment => ({
      ...assignment,
      isExpired: new Date(assignment.dueDate) < new Date(),
    }))

    return NextResponse.json({
      success: true,
      data: assignmentsWithExpiry,
    })
  } catch (error: any) {
    console.error("Error fetching available assignments:", error)
    return NextResponse.json(
      { error: "Failed to fetch assignments", details: error.message },
      { status: 500 }
    )
  }
}