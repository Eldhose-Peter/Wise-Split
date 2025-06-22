import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    userName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    bio: z.string().optional(),
    imageUrl: z.string().url().optional(),
  }),
});

export type RegisterPayload = z.infer<typeof registerSchema>["body"];

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export type LoginPayload = z.infer<typeof loginSchema>["body"];
