import ApiError from "../../utils/ApiError";
import User from "../auth/user.model"
import Role from "../role/role.model";
import { CreateUserPayload, UpdateUserPayload, UserQuery } from "./users.validation";


export const getUsers = async (query: UserQuery) => {

    const { page, limit, search, role, sort } = query;

    const filter: any = {};

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    if (role) {
        filter.role = role;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([

        User.find(filter)
            .populate("role")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),

        User.countDocuments(filter),
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

}

export const getOneUser = async (userId: string, currentUserId: string) => {

    const same = userId === currentUserId;

    const user = await User.findById(userId).populate({
        path: 'role',
        select: "permissions name level",
        populate: {
            path: 'permissions',
            populate: [
                { path: 'module', select: 'name code' },
                { path: 'operation', select: 'name code' }
            ],
            select: " -_id -createdAt -updatedAt -__v"
        }
    }).select("-password -updatedAt -__v -refreshToken");

    if (!user || !user.role) {
        throw new ApiError(404, "User not found");
    }

    if (!same) {

        const currentUser = await User.findById(currentUserId).populate("role");

        if (!currentUser || !currentUser.role) {
            throw new ApiError(403, "You can't view this user");
        }

        if ((currentUser.role as any).level >= (user.role as any).level) {
            throw new ApiError(403, "You can't view this user");
        }

    }

    return user;
}

export const createUser = async (payload: CreateUserPayload, userId: string) => {

    const { email, role, name } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "An account with this email already exists.");

    const targetRole = await Role.findById(role).select("level").lean();
    if (!targetRole) throw new ApiError(404, "Role not found");

    const currentUser = await User.findById(userId).populate("role");

    if ((targetRole as any).level >= (currentUser?.role as any).level) {
        throw new ApiError(403, "You can't create this user");
    }

    const user = await User.create({
        name,
        email,
        role: targetRole._id
    });

    // send email to user


    return user;
}

export const updateUser = async (userId: string, payload: UpdateUserPayload, currentUserId: string,) => {

    const { role, name } = payload;

    const same = userId === currentUserId;

    const targetRole = await Role.findById(role).select("level").lean();
    if (!targetRole) throw new ApiError(404, "Role not found");

    if (!same) {

        const currentUser = await User.findById(currentUserId).populate("role");

        if ((targetRole as any).level >= (currentUser?.role as any).level) {
            throw new ApiError(403, "You can't update this user");
        }
    }

    const update: any = {};

    if (name) update.name = name;
    if (role) update.role = targetRole._id;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        update,
        { new: true }
    ).select("-password -refreshToken -updatedAt -__v");

    if (!updatedUser) throw new ApiError(404, "User not found");

    // tell user via email ( optional )

    return updatedUser;
}

export const toggleStatus = async (userId: string, currentUserId: string) => {

    const same = userId === currentUserId;

    const targetUser = await User.findById(userId).populate("role isActive refreshToken");
    if (!targetUser) throw new ApiError(404, "User not found");

    if (same) throw new ApiError(403, "You can't toggle your own status");

    const currentUser = await User.findById(currentUserId).populate("role");
    if (!currentUser || !currentUser.role) throw new ApiError(403, "You can't toggle this user's status");

    if ((targetUser.role as any).level >= (currentUser.role as any).level) throw new ApiError(403, "You can't toggle this user's status");

    targetUser.isActive = !targetUser.isActive;
    targetUser.refreshToken = "";
    await targetUser.save();

    // send email to user ( optional )

    return targetUser;
}

