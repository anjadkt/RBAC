import jwt from 'jsonwebtoken'
import type { PayloadTypes } from '../modules/auth/auth.types'
import env from '../config/env'

export function createAccessToken(user: PayloadTypes) {

    return jwt.sign(
        {
            userId: String(user.userId),
            email: user.email,
            role: user.role,
            isSuperAdmin: user.isSuperAdmin
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '1d' },
    );

}

export function createRefreshToken(userId: string) {

    return jwt.sign(
        {
            userId: String(userId)
        },
        env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' },
    );

}