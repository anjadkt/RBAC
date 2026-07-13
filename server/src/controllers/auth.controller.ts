import { Request, Response } from "express";


export const register = ((req:Request, res:Response) => {
  try{

  }catch(error){
    res.status(500).json({message : "Server Error!"});
  }
})


export const login = ((req:Request, res:Response) => {
  try{

  }catch(error){
    res.status(500).json({message : "Server Error!"});
  }
})