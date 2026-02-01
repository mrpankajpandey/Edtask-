import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Otp from "@/models/Otp"
import { optType } from "@/enums/OtpType"
import { generateOtp } from "@/lib/otp"
import { sendOtpMail } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: "Email is not registered" },
        { status: 404 }
      )
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Email is not verified" },
        { status: 401 }
      )
    }
    const existingOtp = await Otp.findOne({
      email,
      type: optType.FORGOT_PASSWORD,
    })

    if (existingOtp) {
      return NextResponse.json(
        {
          error:
            "OTP already sent. Please wait 10 minutes before requesting again.",
        },
        { status: 429 }
      )
    }
    const otp = generateOtp()

    await Otp.create({
      email,
      otp,
      type: optType.FORGOT_PASSWORD,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    await sendOtpMail(user.name, email, otp)

    return NextResponse.json({
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
