import { z } from 'zod';

export const createEmployeeSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "name required!")
            .max(50, "name can't exceed 50 characters!"),
        email: z
            .string()
            .email()
            .min(1, "email required!")
            .max(50, "email can't exceed 50 characters!"),
        phone: z
            .string()
            .length(10, "phone number should be 10 digits"),
        department: z
            .string()
            .min(1, "department required!")
            .max(50, "department can't exceed 50 characters!"),
        designation: z
            .string()
            .min(1, "designation required!")
            .max(50, "designation can't exceed 50 characters!"),
        dateOfJoining: z
            .coerce
            .date()
            .min(1, "date of joining required!"),
        manager: z.string().optional().nullable(),
    }),
});

export const updateEmployeeSchema = z.object({
    body: createEmployeeSchema.shape.body.partial(),
});