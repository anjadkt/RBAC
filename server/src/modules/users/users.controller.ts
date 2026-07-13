import ApiResponse from "../../utils/ApiResponse";
import { catchAsync } from "../../utils/catchAsync";
import * as userService from "./users.service";
import { CreateUserPayload, UpdateUserPayload } from "./users.validation";


export const getUsersController = catchAsync(async (req, res) => {

    const users = await userService.getUsers(req.query as any);

    res.status(200).json(
        new ApiResponse(200, "Users fetched successfully", users)
    );
});

export const getOneUserController = catchAsync(async (req, res) => {

    const user = await userService.getOneUser(
        req.params.id as string || "",
        req.user?.userId as string
    );

    res.status(200).json(
        new ApiResponse(200, "User fetched successfully", user)
    );
});

export const createUserController = catchAsync(async (req, res) => {

    const user = await userService.createUser(
        req.body as CreateUserPayload,
        req.user?.userId as string
    );

    res.status(201).json(
        new ApiResponse(201, "User created successfully", user)
    );
});

export const updateUserController = catchAsync(async (req, res) => {

    const updatedUser = await userService.updateUser(
        req.params.id as string,
        req.body as UpdateUserPayload,
        req.user?.userId as string
    );

    res.status(200).json(
        new ApiResponse(200, "User updated successfully", updatedUser)
    );
});

export const toggleStatusController = catchAsync(async (req, res) => {

    const updatedUser = await userService.toggleStatus(
        req.params.id as string,
        req.user?.userId as string
    );

    res.status(200).json(
        new ApiResponse(200, "User status changed successfully", updatedUser)
    );
})


