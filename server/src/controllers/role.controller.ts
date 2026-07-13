import { Request, Response } from "express";
import Role from "../models/role.model";
import Permission from "../models/permission.model";


export const createRole = async (req:Request, res:Response) => {
  try{

    const { name , permissions, description, isSystem } = req.body ;

    const isSuperAdmin = req.user?.isSuperAdmin ;

    if(!isSuperAdmin && isSystem) return res.status(403).json({message : "Not allowed to create this role!"});

    const isAlready = await Role.findOne({name}).lean();
    if(isAlready)return res.status(409).json({message : "Role already exist!"});

    const query = isSuperAdmin ? {_id : { $in : permissions }} : { _id : { $in : permissions }, isSystem : false }

    const validPermissions = await Permission.find(query);
    if(validPermissions.length !== permissions.length)return res.status(400).json({meesage : "some permissions are not valid!"})

    const role = await Role.create({
      name,
      description,
      isSystem,
      permissions
    });

    res.status(201).json({
      message : "role created!",
      response : role
    });

  }catch(error){
    console.log(error);
    res.status(500).json({message : "Server Error!", error});
  }
}

export const getRoles = async (req:Request, res:Response) => {
  try{

    const query = req.user?.isSuperAdmin ? {} : { isSystem : false} ;

    const roles = await Role.find(query).populate("permissions", "name label description");

    res.json({response : roles});

  }catch(error){
    res.status(500).json({message : "Server Error!"});
  }
}