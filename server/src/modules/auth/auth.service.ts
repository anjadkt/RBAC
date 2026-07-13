import env from "../../config/env";
import ApiError from "../../utils/ApiError";
import { createAccessToken, createRefreshToken } from "../../utils/createTokens";
import { RegisterPayload } from "./auth.types";
import User from "./user.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const login = async (payload: Omit<RegisterPayload, "name">) => {

    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid email or password.");

    const isVerified = await bcrypt.compare(password.toString(), user.password || "");
    if (!isVerified) throw new ApiError(401, "Invalid email or password.");

    const accessToken = createAccessToken({
        userId: user._id.toString(),
        role: user.role,
        email: user.email
    })
    const refreshToken = createRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        accessToken,
        refreshToken
    };
}

export const getMe = async (userId: string) => {

    const user = User.findById(userId).populate({
        path: 'role',
        select: "permissions name",
        populate: {
            path: 'permissions',
            populate: [
                { path: 'module', select: 'name code' },
                { path: 'operation', select: 'name code' }
            ],
            select: " -_id -createdAt -updatedAt -__v"
        }
    }).select("-password -updatedAt -__v -refreshToken");

    if (!user) throw new ApiError(404, "User not found!");

    return user;
}

export const refresh = async (refreshToken: string) => {

    const decodedToken = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string }
    if (!decodedToken) throw new ApiError(401, "Invalid or expired refresh token.");

    const user = await User.findById(decodedToken.userId);
    if (!user) throw new ApiError(401, "Invalid or expired refresh token.");

    const accessToken = createAccessToken({
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin || false
    })
    const newRefreshToken = createRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken: newRefreshToken
    };
}

export const logout = async (userId: string) => {
    await User.findOneAndUpdate(
        { _id: userId },
        { $unset: { refreshToken: "" } }
    )
    return;
}
