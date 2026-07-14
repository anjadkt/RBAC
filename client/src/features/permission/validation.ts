import { z } from "zod";

export const permissionSchema = z.object({
    module: z
        .string()
        .trim()
        .min(1, "Module is required"),

    operation: z
        .string()
        .trim()
        .min(1, "Operation is required"),

    label: z
        .string()
        .trim()
        .min(3, "Label must be at least 3 characters")
        .max(100, "Label cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional(),
});