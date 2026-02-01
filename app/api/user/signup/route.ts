import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { optType } from "@/enums/OtpType";
import { generateOtp } from "@/lib/otp";
import { sendOtpMail } from "@/lib/mail";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, password, phone } = parsed.data;

  const exists = await User.findOne({ email });

  if (exists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 },
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    provider: "credentials",
  });

  // generate otp
  const otp = generateOtp();

  await Otp.create({
    email,
    otp,
    type: optType.SIGNUP,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpMail(user.email, user.name, otp);

  return NextResponse.json({
    data: {
      user,
      message: "Registered successfully. OTP sent to email.",
    },
  });
}
