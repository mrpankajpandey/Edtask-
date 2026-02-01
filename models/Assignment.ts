import mongoose, { Schema, model, models } from "mongoose";

const AssignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Students enrolled in this assignment
    enrolledStudents: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        submissionStatus: {
          type: String,
          enum: ["NOT_SUBMITTED", "SUBMITTED"],
          default: "NOT_SUBMITTED",
        },
        submittedAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true },
);

export default models.Assignment || model("Assignment", AssignmentSchema);
