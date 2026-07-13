
export type PayloadTypes = {
    _id: unknown;
    email: string;
    role?: unknown;
    isSuperAdmin?: boolean
}

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
}