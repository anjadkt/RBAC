import { catchAsync } from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import * as roleService from './role.service';


export const createRole = catchAsync(async (req, res) => {

  const role = await roleService.create(req.body);

  res.status(201).json(
    new ApiResponse(201, "Role created successfully.", role)
  );

})

export const updateRole = catchAsync(async (req, res) => {

  const role = await roleService.update(req.body, req.params.roleId as string);

  res.status(201).json(
    new ApiResponse(201, "Role updated successfully.", role)
  );
})

export const getRoles = catchAsync(async (req, res) => {

  const roles = await roleService.getRoles(
    req.user?.userId as string,
    req.user?.isSuperAdmin || false
  );

  res.json(new ApiResponse(200, "Roles fetched successfully.", roles));

})