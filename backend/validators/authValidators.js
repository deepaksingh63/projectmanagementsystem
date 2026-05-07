import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
    title: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Please enter a valid email"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    title: z.string().optional(),
    avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
