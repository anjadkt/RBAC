import ApiError from "../../utils/ApiError";
import Role from "../role/role.model";
import { RegisterPayload } from "./auth.types";
import User from "./user.model";
import bcrypt from 'bcrypt'


export const register = async (payload: RegisterPayload) => {

    const { name, email, password } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "An account with this email already exists.");

    const hashedPass = await bcrypt.hash(password.toString(), 10);

    const role = await Role.findOne({ name: "patient" });

    const user = await User.create({
        name: String(name).trim(),
        email,
        password: hashedPass,
        role: role?._id
    });

    return user;
}

export const login = async (payload: Omit<RegisterPayload, "name">) => {

    const { email, password } = payload;

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid email or password.");

    const isVerified = await bcrypt.compare(password.toString(), user.password);
    if (!isVerified) throw new ApiError(401, "Invalid email or password.");

    return user;
}

export const getMe = async (userId: string) => {

    const user = User.findById(userId);
    if (!user) throw new ApiError(404, "User not found!");
}
