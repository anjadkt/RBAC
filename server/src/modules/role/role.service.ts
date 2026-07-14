import ApiError from "../../utils/ApiError";
import User from "../auth/user.model";
import Permission from "../permission/permission.model";
import Role from "./role.model";
import { RolePayload } from "./role.validate";


export const create = async (payload: RolePayload) => {

    const { name, permissions, description, level, isSystem } = payload;

    const isAlready = await Role.findOne({ name }).lean();
    if (isAlready) throw new ApiError(409, "Role already exist!");

    const validPermissions = await Permission.find({ _id: { $in: permissions } });
    if (
        !validPermissions.length ||
        validPermissions.length !== permissions.length
    ) throw new ApiError(400, "some permissions are not valid!")

    const role = await Role.create({
        name,
        description,
        permissions,
        level,
        isSystem
    });

    return role;
}

export const update = async (payload: Partial<RolePayload>, roleId: string) => {

    if (payload.permissions) {
        const validPermissions = await Permission.find({ _id: { $in: payload.permissions } });
        if (
            !validPermissions.length ||
            validPermissions.length !== payload.permissions.length
        ) throw new ApiError(400, "some permissions are not valid!")
    }

    const role = await Role.findByIdAndUpdate(
        roleId,
        payload,
        { new: true }
    ).populate("permissions", "label description");

    if (!role) throw new ApiError(404, "Role not found!");

    return role;
}

export const getRoles = async (userId: string, isSuperAdmin: boolean) => {

    const user = await User.findById(userId).populate("role", "level");
    if (!user) throw new ApiError(403, "Not allowed to access this resource");

    const query = isSuperAdmin
        ? { level: { $neq: 0 } }
        : { level: { $gt: (user.role as any).level }, isSystem: false };

    const roles = await Role.find(query).select("-__v -updatedAt").populate("permissions", "_id label description");

    return roles;
}