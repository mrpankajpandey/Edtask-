import { userRoles } from "@/enums/Roles"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: userRoles
      phone?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: userRoles
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: userRoles
    phone?: string
  }
}
