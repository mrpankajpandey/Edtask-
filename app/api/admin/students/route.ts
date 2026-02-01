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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * limit

    // Build query
    const query: any = { role: userRoles.STUDENT }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    const [students, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("name email phone isVerified createdAt")
        .lean(),
      User.countDocuments(query),
    ])

    // Get enrollment count for each student
    const studentsWithEnrollments = await Promise.all(
      students.map(async (student) => {
        const enrollmentCount = await Assignment.countDocuments({
          "enrolledStudents.student": student._id,
        })
        return {
          ...student,
          enrollmentCount,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: studentsWithEnrollments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students", details: error.message },
      { status: 500 }
    )
  }
}