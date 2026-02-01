import { z } from "zod"

export const createAssignmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  subject: z.string().min(2),
  dueDate: z.string(),
})

export const updateAssignmentSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  subject: z.string().min(2).optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional(),
})
