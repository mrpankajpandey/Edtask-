import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Otp from "@/models/Otp"
import { registerSchema } from "@/lib/validations/auth"
import { generateOtp } from "@/lib/otp"
import { otpType } from "@/enums/OtpType"
import { sendOtpMail } from "@/lib/sendOtpMail"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const parsed = registerSchema.safeParse(body)

    // ✅ ZOD VALIDATION ERROR
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, password, phone } = parsed.data

    // ✅ USER EXISTS
    const exists = await User.findOne({ email })

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      )
    }

    // ✅ CREATE USER
    const user = await User.create({
      name,
      email,
      password,
      phone,
      provider: "credentials",
    })

    // ✅ GENERATE OTP
    const otp = generateOtp()

    await Otp.create({
      email,
      otp,
      type: otpType.SIGNUP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    await sendOtpMail(user.name, user.email, otp, "signup")

    // ✅ SUCCESS RESPONSE
    return NextResponse.json(
      {
        success: true,
        message: "Registered successfully. OTP sent to email.",
        data: {
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register error:", error)

    // ✅ FALLBACK ERROR
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    )
  }
}


