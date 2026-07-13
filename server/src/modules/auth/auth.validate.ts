import { z } from "zod";


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