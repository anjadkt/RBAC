import z from "zod";

export const roleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name cannot exceed 50 characters'),

    description: z
        .string()
        .trim()
        .max(255, 'Description cannot exceed 255 characters')
        .optional(),

    permissions: z
        .array(z.string())
        .min(1, 'Select at least one permission'),
});

export type RoleType = z.infer<typeof roleSchema>;