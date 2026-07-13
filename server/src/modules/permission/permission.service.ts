import ApiError from "../../utils/ApiError";
import Module from "../module/module.model";
import Operation from "../operation/operation.modal";
import Permission from "./permission.model";
import { PermissionType } from "./permission.validation";

export const permission = async (payload: PermissionType) => {

    const { module, operation, label, description } = payload;

    const existingModule = await Module.findById(module).select("code").lean();
    if (!existingModule) throw new ApiError(404, "Module not found!");

    const existingOperation = await Operation.findById(operation).select("code").lean();
    if (!existingOperation) throw new ApiError(404, "Operation not found!");

    const code = `${existingModule.code}.${existingOperation.code}`;

    const isAlready = await Permission.findOne({ code }).lean();
    if (isAlready) throw new ApiError(409, "permission already user")

    const permission = await Permission.create({
        module,
        operation,
        code,
        label,
        description
    })

    return permission;
}