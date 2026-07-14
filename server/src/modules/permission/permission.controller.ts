import Permission from "./permission.model";
import { catchAsync } from "../../utils/catchAsync";
import ApiResponse from "../../utils/ApiResponse";
import * as permissionService from "./permission.service";


export const getPermissions = catchAsync(async (req, res) => {

  const search = req.query.search;

  const matchStage = search
    ? {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
          { label: { $regex: search, $options: "i" } },
        ],
      },
    }
    : { $match: {} };

  const permissions = await Permission.aggregate([
    matchStage,
    {
      $lookup: {
        from: "modules",
        localField: "module",
        foreignField: "_id",
        as: "module",
      },
    },
    {
      $unwind: "$module",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        code: 1,
        description: 1,
        label: 1,
        createdAt: 1,
        moduleId: "$module._id",
        moduleName: "$module.name",
      },
    },
    {
      $group: {
        _id: "$moduleId",
        module: {
          $first: "$moduleName"
        },
        permissions: {
          $push: {
            _id: "$_id",
            name: "$name",
            code: "$code",
            label: "$label",
            description: "$description",
            createdAt: "$createdAt",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        moduleId: "$_id",
        module: 1,
        permissions: 1,
      },
    },
    {
      $sort: {
        "module.name": 1,
      },
    },
  ]);

  res.json(
    new ApiResponse(
      200,
      "Permissions fetched successfully.",
      permissions
    )
  );
});

export const createPermission = catchAsync(async (req, res) => {

  const permission = await permissionService.permission(req.body);

  res
    .json(
      new ApiResponse(
        200,
        "Permission created successfully.",
        {
          moduleId: permission.module,
          code: permission.code,
          label: permission.label,
          description: permission.description,
          _id: permission._id,
          createdAt: permission.createdAt
        }
      )
    );

})