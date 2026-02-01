import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { userRoles } from "@/enums/Roles";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: [userRoles.STUDENT, userRoles.ADMIN],
      default: userRoles.STUDENT,
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (!this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export default models.User || model("User", UserSchema);
