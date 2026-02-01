"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import axios from "axios"

interface Assignment {
    _id: string
    title: string
    description: string
    subject: string
    dueDate: string
    status: "PENDING" | "COMPLETED"
}

interface AssignmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignment?: Assignment | null
    onSuccess: () => void
}

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    subject: z.string().min(2, "Subject must be at least 2 characters"),

    dueDate: z
        .date()
        .refine((date) => date instanceof Date, {
            message: "Due date is required",
        }),

    status: z.enum(["PENDING", "COMPLETED"]).optional(),
})


export function AssignmentDialog({
    open,
    onOpenChange,
    assignment,
    onSuccess,
}: AssignmentDialogProps) {
    const isEdit = !!assignment

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            subject: "",
            dueDate: new Date(),
            status: "PENDING",
        },
    })

    useEffect(() => {
        if (assignment) {
            form.reset({
                title: assignment.title,
                description: assignment.description,
                subject: assignment.subject,
                dueDate: new Date(assignment.dueDate),
                status: assignment.status,
            })
        } else {
            form.reset({
                title: "",
                description: "",
                subject: "",
                dueDate: new Date(),
                status: "PENDING",
            })
        }
    }, [assignment, form])


const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    const payload = {
      ...values,
      dueDate: values.dueDate.toISOString(),
    }

    const url = isEdit
      ? `/api/admin/assignments/${assignment._id}`
      : "/api/admin/assignments"

    const { data } = await axios({
      url,
      method: isEdit ? "put" : "post",
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (data.success) {
      toast.success(
        `Assignment ${isEdit ? "updated" : "created"} successfully`
      )
      onSuccess()
      onOpenChange(false)
      form.reset()
    } else {
      toast.error(data.error || "Something went wrong")
    }
  } catch (error) {
    toast.error("Failed to save assignment")
  }
}

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Assignment" : "Create New Assignment"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the assignment details below"
                            : "Fill in the details to create a new assignment"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Assignment title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Assignment description"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Mathematics" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isEdit && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting
                                    ? "Saving..."
                                    : isEdit
                                        ? "Update"
                                        : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}