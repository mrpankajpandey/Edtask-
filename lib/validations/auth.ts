import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  phone:z.string().max(12,"Maxximum 12 character"),
  password: z.string().min(6, "Minimum 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
