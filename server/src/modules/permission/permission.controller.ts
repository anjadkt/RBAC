import Permission from "./permission.model";
import { catchAsync } from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import * as permissionService from "./permission.service";


export const getPermissions = catchAsync(async (_req, res) => {

  const permissions = await Permission.find({}).lean();

  res.json(new ApiResponse(200, "Permissions fetched successfully.", permissions));

})

export const createPermission = catchAsync(async (req, res) => {

  const permission = await permissionService.permission(req.body);

  res.json(new ApiResponse(200, "Permission created successfully.", permission));

})