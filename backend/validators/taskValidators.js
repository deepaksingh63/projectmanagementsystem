import { z } from "zod";

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Task title must be at least 3 characters"),
    description: z.string().optional(),
    assignedTo: z.string().min(1, "Assigned user is required"),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
    dueDate: z.string().min(1, "Due date is required"),
    projectId: z.string().min(1, "Project is required"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const commentSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Comment cannot be empty"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
