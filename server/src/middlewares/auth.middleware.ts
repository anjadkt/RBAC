import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import env from '../config/env'
import ApiError from '../utils/ApiError'
import User from '../modules/auth/user.model'

type AuthTokenPayload = {
  userId: string
  email: string
  role?: unknown
  isSuperAdmin: boolean
}

async function authenticate(req: Request, _res: Response, next: NextFunction) {

  const token = req.cookies?.access_token

  if (!token) return next(new ApiError(401, "Authentication required."))

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload
    if (!payload) return next(new ApiError(401, "Invalid or expired authentication token."));

    const user = await User.findById(payload.userId).select("_id isActive role isSuperAdmin refreshToken").lean()
    if (!user) return next(new ApiError(401, "Invalid or expired authentication token."));
    if (!user.isActive || !user.refreshToken) return next(new ApiError(403, "You are currently inactive or logged out. Please log in again."));

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || false
    }

    return next();

  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
}

export default authenticate
