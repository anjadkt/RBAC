import Permission from "./permission.model";
import { catchAsync } from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";


export const getPermissions = catchAsync(async (req, res) => {

  const query = req.user?.isSuperAdmin ? {} : { isSystem: false }

  const permissions = await Permission.find(query);

  res.json(new ApiResponse(200, "Permissions fetched successfully.", permissions));

})

export const createPermission = catchAsync(async (req, res) => {

  const { name, label, module, action, isSystem, description } = req.body;

  const isAlready = await Permission.findOne({ name }).lean();
  if (isAlready) throw new ApiError(409, "name already user")

  const permission = await Permission.create({
    name,
    label,
    module,
    action,
    isSystem,
    description
  });

  res.json(new ApiResponse(200, "Permission created successfully.", permission))

})