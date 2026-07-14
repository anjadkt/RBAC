import { z } from "zod";
import { Types } from "mongoose";

const objectId = z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid objectId",
});

const querySchema = z.object({
    search: z.string().trim().optional()
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


const updateSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50)
        .toLowerCase(),

    role: objectId,

    isActive: z.coerce
        .boolean()
        .default(true),

}).strip();

export const updateUserSchema = z.object({
    body: updateSchema,
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

