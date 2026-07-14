import env from "../config/env"


export const accessCookieOptions = env.NODE_ENV === 'production'
    ? {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        maxAge: 15 * 60 * 1000,
        partitioned: true,
    }
    : {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        maxAge: 15 * 60 * 1000,
    }

export const refreshCookieOptions = env.NODE_ENV === 'production'
    ? {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        partitioned: true,
    }
    : {
        httpOnly: true,
        secure: false,
        sameSite: 'lax' as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
