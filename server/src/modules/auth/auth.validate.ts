import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(50),

        email: z
            .string()
            .email()
            .trim()
            .toLowerCase()
            .max(100),

        password: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters")
            .max(100)
    }),
});


export const loginSchema = z.object({
    body: z.object({

        email: z
            .string()
            .email()
            .trim()
            .max(100),

        password: z
            .string()
            .trim()
            .min(6, "Password must be at least 6 characters")
            .max(100)
    }),
});