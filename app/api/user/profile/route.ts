import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/config/authOptions"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  await connectDB()

  const user = await User.findById(session.user.id).select("-password")

  return NextResponse.json(user)
}
