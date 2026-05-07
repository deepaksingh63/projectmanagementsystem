import { z } from "zod";

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Project title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    members: z.array(z.string()).default([]),
    deadline: z.string().min(1, "Deadline is required"),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["planning", "in-progress", "completed"]).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
