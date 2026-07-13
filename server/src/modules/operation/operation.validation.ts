import { z } from "zod"

export const operationSchema = z.object({
    name: z
        .string()
        .min(1, "Module name is required.")
        .max(50, "Module name cannot exceed 50 characters.")
        .trim(),
    code: z
        .string()
        .min(1, "Module code is required.")
        .max(30, "Module code cannot exceed 30 characters.")
        .toLowerCase()
        .trim(),
})
