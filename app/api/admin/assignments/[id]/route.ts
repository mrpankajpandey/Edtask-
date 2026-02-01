import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import dbConnect from "@/lib/db";
import Assignment from "@/models/Assignment";
import { updateAssignmentSchema } from "@/lib/validations/assignment";
import { userRoles } from "@/enums/Roles";
import mongoose from "mongoose";

// GET - Get single assignment
export async function GET(
   req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== userRoles.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await dbConnect();

    const assignment = await Assignment.findById(id)
      .populate("user", "name email")
      .lean();

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: assignment });
  } catch (error: any) {
    console.error("Error fetching assignment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment", details: error.message },
      { status: 500 },
    );
  }
}

// PUT - Update assignment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== userRoles.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const body = await req.json()
    
    const validation = updateAssignmentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    await dbConnect()

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      { $set: validation.data },
      { new: true, runValidators: true }
    ).lean()
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: assignment })
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update assignment", details: error.message },
      { status: 500 }
    )
  }
}


// DELETE - Delete assignment
export async function DELETE(
   req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== userRoles.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid assignment ID" },
        { status: 400 },
      );
    }

    await dbConnect();

    const assignment = await Assignment.findByIdAndDelete(id).lean();

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment", details: error.message },
      { status: 500 },
    );
  }
}
