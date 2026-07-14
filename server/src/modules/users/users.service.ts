import { PipelineStage } from "mongoose";
import ApiError from "../../utils/ApiError";
import User from "../auth/user.model"
import Role from "../role/role.model";
import { CreateUserPayload, UpdateUserPayload, UserQuery } from "./users.validation";


export const getUsers = async (query: UserQuery, userId: string) => {

    const currentUser = await User.findById(userId)
        .populate("role", "level")
        .lean();

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    const currentLevel = (currentUser.role as any).level;

    const { search } = query;

    const match: any = {
        "role.level": { $gt: currentLevel },
    };

    if (search) {
        match.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const pipeline: PipelineStage[] = [
        {
            $lookup: {
                from: "roles",
                localField: "role",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: "$role",
        },
        {
            $match: match,
        },
        {
            $sort: {
                "role.level": 1,
                name: 1,
            },
        },
        {
            $group: {
                _id: "$role._id",
                role: {
                    $first: "$role.name",
                },
                users: {
                    $push: {
                        _id: "$_id",
                        name: "$name",
                        email: "$email",
                        isActive: "$isActive",
                        createdAt: "$createdAt",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                roleId: "$_id",
                role: 1,
                users: 1,
            },
        },
        {
            $sort: {
                level: 1,
            },
        },
    ]

    return await User.aggregate(pipeline);
};

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

    if ((currentUser?.role as any).level >= (targetRole as any).level) {
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

    const { role, name, isActive, } = payload;

    const same = userId === currentUserId;

    const targetRole = await Role.findById(role).select("level").lean();
    if (!targetRole) throw new ApiError(404, "Role not found");

    if (!same) {

        const currentUser = await User.findById(currentUserId).populate("role");

        if (((currentUser?.role as any).level <= targetRole as any).level) {
            throw new ApiError(403, "You can't update this user");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: { name, role: targetRole._id, isActive }
        },
        { new: true }
    ).select("-password -refreshToken -updatedAt -__v");

    if (!updatedUser) throw new ApiError(404, "User not found");

    // tell user via email ( optional )

    return updatedUser;
}

