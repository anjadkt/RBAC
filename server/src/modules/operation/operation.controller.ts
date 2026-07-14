import { catchAsync } from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import Operation from "./operation.modal";

export const getOperations = catchAsync(async (_req, res) => {

    const operations = await Operation.find({}).select("-updatedAt -__v").lean();

    res.status(200).json(new ApiResponse(200, "Operation fetched successfully.", operations));

});

export const createOperation = catchAsync(async (req, res) => {

    const { name, code } = req.body;

    const existingOperation = await Operation.findOne({ code });
    if (existingOperation) throw new ApiError(409, "Operation already exists.");

    const operation = await Operation.create({ name, code });

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Operation created successfully.",
                {
                    _id: operation._id,
                    name: operation.name,
                    createdAt: operation.createdAt,
                    code: operation.code
                }
            )
        );

});