import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import dbConnect from "@/lib/db";
import Assignment from "@/models/Assignment";
import { createAssignmentSchema } from "@/lib/validations/assignment";
import { userRoles } from "@/enums/Roles";

// GET - List all assignments
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== userRoles.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const subject = searchParams.get("subject");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (subject) query.subject = subject;

    const [assignments, total] = await Promise.all([
      Assignment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .lean(),
      Assignment.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: assignments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments", details: error.message },
      { status: 500 },
    );
  }
}

// POST - Create new assignment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== userRoles.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validation = createAssignmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const assignment = await Assignment.create({
      ...validation.data,
      user: session.user.id,
    });

    return NextResponse.json(
      { success: true, data: assignment },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Failed to create assignment", details: error.message },
      { status: 500 },
    );
  }
}
