import { Types } from "mongoose";
import { z } from "zod";

const objectId = z.string().refine(
    (value) => Types.ObjectId.isValid(value),
    {
        message: "Invalid ObjectId",
    }
);

const roleBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Role name must be at least 3 characters")
        .max(50, "Role name cannot exceed 50 characters"),

    permissions: z
        .array(objectId)
        .min(1, "At least one permission is required"),

    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional(),

    isSystem: z
        .boolean()
        .default(false),
});

export const roleSchema = z.object({
    body: roleBodySchema,
});

export const roleUpdateSchema = z.object({
    params: z.object({
        roleId: objectId,
    }),
    body: roleBodySchema.partial(),
});

export type RolePayload = z.infer<typeof roleBodySchema>;
