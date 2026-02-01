"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  const user = session?.user

  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          EduTask
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/auth/signin">
              <Button size="sm">Sign in</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="h-9 w-9">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name || "User"} />
                    ) : (
                      <AvatarFallback className="uppercase">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href={
                      user.role === "ADMIN"
                        ? "/admin"
                        : "/student"
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
