import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import env from '../config/env'

type AuthTokenPayload = {
  userId: string
  email: string
  role?: unknown
  isSuperAdmin : boolean
}

export function authenticate(req: Request, res: Response, next: NextFunction) {

  const token = req.cookies?.access_token 

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      isSuperAdmin : payload.isSuperAdmin || false
    }

    return next();
    
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' })
  }
}
