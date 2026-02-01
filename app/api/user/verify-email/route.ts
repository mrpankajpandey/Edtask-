import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { otpType } from "@/enums/OtpType";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
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
    const existingOtp = await Otp.findOne({
      email,
      type: otpType.SIGNUP,
    });

    if (!existingOtp) {
      return NextResponse.json(
        { message: "OTP not generated or expired" },
        { status: 401 },
      );
    }
    if (otp !== existingOtp.otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    user.isVerified = true;
    await user.save();
    await Otp.deleteMany({ email, type: otpType.SIGNUP });

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
