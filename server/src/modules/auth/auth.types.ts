
export type PayloadTypes = {
    userId: unknown;
    email: string;
    role?: unknown;
    isSuperAdmin?: boolean
}

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
}