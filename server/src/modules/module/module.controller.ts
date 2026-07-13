import { catchAsync } from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import Module from "./module.model";
import ApiError from "../../utils/ApiError";

export const getModule = catchAsync(async (_req, res) => {

    const modules = await Module.find({}).lean();

    res.status(200).json(new ApiResponse(200, "Module fetched successfully.", modules));

});

export const createModule = catchAsync(async (req, res) => {

    const { name, code } = req.body;

    const existingModule = await Module.findOne({ code });
    if (existingModule) throw new ApiError(409, "Module already exists.");

    const module = await Module.create({ name, code });

    res.status(200).json(new ApiResponse(200, "Module created successfully.", module));

});