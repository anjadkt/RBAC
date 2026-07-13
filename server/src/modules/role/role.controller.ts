import Role from "./role.model";
import Permission from "../permission/permission.model";
import ApiError from "../../utils/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";


export const createRole = catchAsync(async (req, res) => {

  const { name, permissions, description } = req.body;

  const isAlready = await Role.findOne({ name }).lean();
  if (isAlready) throw new ApiError(409, "Role already exist!");

  const validPermissions = await Permission.find({ _id: { $in: permissions }, isSystem: false });
  if (
    !validPermissions.length ||
    validPermissions.length !== permissions.length
  ) throw new ApiError(400, "some permissions are not valid!")

  const role = await Role.create({
    name,
    description,
    permissions
  });

  res.status(201).json(
    new ApiResponse(201, "Role created successfully.", role)
  );

})

export const getRoles = catchAsync(async (req, res) => {

  const query = req.user?.isSuperAdmin ? { name: { $ne: "SUPER_ADMIN" } } : { isSystem: false };

  const roles = await Role.find(query).populate("permissions", "name label description");

  res.json(new ApiResponse(200, "Roles fetched successfully.", roles));

})