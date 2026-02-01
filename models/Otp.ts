import mongoose, { Schema, model, models } from "mongoose";
import { otpType } from "@/enums/OtpType";

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [otpType.FORGOT_PASSWORD, otpType.SIGNUP],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL
    },
  },
  { timestamps: true },
);

export default models.Otp || model("Otp", OtpSchema);
