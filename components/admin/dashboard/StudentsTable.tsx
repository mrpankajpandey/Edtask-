"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Search, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {toast} from 'sonner'
interface Student {
  _id: string
  name: string
  email: string
  phone: string
  isVerified: boolean
  createdAt: string
  enrollmentCount: number
}

export function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])


const fetchStudents = async () => {
  try {
    setLoading(true)

    const params: any = {}
    if (searchTerm) params.search = searchTerm

    const { data } = await axios.get("/api/admin/students", { params })

    if (data.success) {
      setStudents(data.data)
    } else {
      toast.error("Failed to fetch students")
    }
  } catch (error) {
    toast.error("Failed to fetch students")
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchStudents()
    }, 500)

    return () => clearTimeout(debounce)
  }, [searchTerm])

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Students</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {student.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.isVerified ? "default" : "secondary"}>
                      {student.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.enrollmentCount}</Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(student.createdAt), "PP")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}