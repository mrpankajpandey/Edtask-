import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { otpType } from "@/enums/OtpType";
import { generateOtp } from "@/lib/otp";
import { sendOtpMail } from "@/lib/sendOtpMail";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Email is not registered" },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 },
      );
    }

    await Otp.deleteMany({
      email,
      type: otpType.SIGNUP,
    });
    const otp = generateOtp();
    await Otp.create({
      email,
      otp,
      type: otpType.SIGNUP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await sendOtpMail(user.email, user.name, otp, "signup");

    return NextResponse.json({
      message: "OTP sent again",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
