import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import env from '../config/env'
import ApiError from '../utils/ApiError'

type AuthTokenPayload = {
  userId: string
  email: string
  role?: unknown
  isSuperAdmin: boolean
}

function authenticate(req: Request, _res: Response, next: NextFunction) {

  const token = req.cookies?.access_token

  if (!token) return next(new ApiError(401, "Authentication required."))

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      isSuperAdmin: payload.isSuperAdmin || false
    }

    return next();

  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
}

export default authenticate
