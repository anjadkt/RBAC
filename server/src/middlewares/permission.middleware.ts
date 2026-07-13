import type { NextFunction, Request, Response } from 'express'
import Role from '../models/role.model'

type Permission = {
  name?: string
}

export function authorize(...allowedPermissions: string[]) {

  return async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    if (!req.user.role) {
      return res.status(403).json({ message: 'No role is assigned to this user.' })
    }

    try {
      
      const role = await Role.findById(req.user.role)
        .populate('permissions', 'name')
        .lean()

      if (!role) {
        return res.status(403).json({ message: 'User role was not found.' })
      }

      if(req.user.isSuperAdmin) return next();

      const rolePermissions = (role.permissions ?? []) as Permission[]
      const hasPermission = rolePermissions.some((permission) =>
        allowedPermissions.includes(permission.name ?? ''),
      )

      if (!hasPermission) {
        return res.status(403).json({ message: 'You do not have permission for this action.' })
      }

      return next()
    } catch {
      return res.status(500).json({ message: 'Unable to check user permissions.' })
    }
  }
}
