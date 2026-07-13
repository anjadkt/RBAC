import type { NextFunction, Request, Response } from 'express'
import Role from '../modules/role/role.model'
import ApiError from '../utils/ApiError'

type Permission = {
  code?: string
}

function authorize(...allowedPermissions: string[]) {

  return async (req: Request, _res: Response, next: NextFunction) => {

    if (!req.user) return next(new ApiError(401, "Authentication required."));

    if (!req.user.role) return next(new ApiError(403, "No role is assigned to this user."));

    try {

      const role = await Role.findById(req.user.role)
        .populate('permissions', 'code')
        .lean()

      if (!role) return next(new ApiError(403, "User role was not found."));

      if (req.user.isSuperAdmin) return next();

      const rolePermissions = (role.permissions ?? []) as Permission[]
      const hasPermission = rolePermissions.some((permission) =>
        allowedPermissions.includes(permission.code ?? ''),
      )

      if (!hasPermission) return next(new ApiError(403, "You do not have permission for this action."));

      return next()
    } catch (error) {
      return next(new ApiError(500, "Unable to check user permissions."));
    }
  }
}

export default authorize
