import { z } from "zod";
import { Types } from "mongoose";

const objectId = z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid objectId",
});

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    role: objectId.optional(),
    sort: z.enum(["name", "-name", "createdAt", "-createdAt"]).default("-createdAt"),
});


const userSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50)
        .toLowerCase(),

    email: z
        .string()
        .email()
        .trim()
        .toLowerCase()
        .max(100),

    role: objectId,

}).strip();


// create users 

export const createUserSchema = z.object({
    body: userSchema
});

export type CreateUserPayload = z.infer<typeof userSchema>;

// update users

export const updateUserSchema = z.object({
    body: userSchema.omit({ email: true }).partial(),
    params: z.object({
        id: objectId
    })
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema.shape.body>;


// get users

export const getUsersSchema = z.object({
    query: querySchema,
});

export type UserQuery = z.infer<typeof querySchema>;

