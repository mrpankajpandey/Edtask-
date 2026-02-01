import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Otp from "@/models/Otp"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  await connectDB()

  const { email, otp, oldPass, newPass } = await req.json()

  const otpDoc = await Otp.findOne({ email, otp })
  if (!otpDoc)
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })

  const user = await User.findOne({ email }).select("+password")
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 })

  if (oldPass) {
    const match = await bcrypt.compare(oldPass, user.password)
    if (!match)
      return NextResponse.json({ message: "Old password wrong" }, { status: 400 })
  }

  user.password = newPass
  await user.save()

  await Otp.deleteMany({ email })

  return NextResponse.json({ message: "Password updated" })
}
