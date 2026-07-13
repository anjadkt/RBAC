import { Request, Response } from "express";
import Permission from "../models/permission.model";


export const getPermissions = async ( req:Request, res:Response ) => {
  try{

    const query = req.user?.isSuperAdmin ? {} : { isSystem : false }

    const permissions = await Permission.find(query);

    res.json({ response : permissions });

  }catch(error){
    res.status(500).json({message : "Server Error!"});
  }
}

export const createPermission = async ( req:Request, res:Response ) => {
  try{

    const { name, label, module, action, isSystem, description } = req.body ;

    const isAlready = await Permission.findOne({name}).lean();
    if(isAlready)return res.status(409).json({message : "name already used!"});

    const permission = await Permission.create({
      name,
      label,
      module,
      action,
      isSystem,
      description
    });

    res.json({ response : permission })

  }catch(error){
    res.status(500).json({message : "Server Error!"});
  }
}