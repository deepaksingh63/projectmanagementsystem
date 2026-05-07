import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name should be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters"),
  title: z.string().optional(),
  avatar: z.string().url("Enter a valid image URL").or(z.literal("")),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Project title should be at least 3 characters"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  deadline: z.string().min(1, "Deadline is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["planning", "in-progress", "completed"]),
  members: z.array(z.string()).default([]),
});

export const taskSchema = z.object({
  title: z.string().min(3, "Task title should be at least 3 characters"),
  description: z.string().optional(),
  assignedTo: z.string().min(1, "Please assign the task"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
  dueDate: z.string().min(1, "Due date is required"),
  projectId: z.string().min(1, "Please select a project"),
});
