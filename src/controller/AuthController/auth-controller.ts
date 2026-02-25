import { Request, Response } from "express";
import User from "../../database/model/user-model";


class AuthController{
    static async register (req:Request, res:Response) {
        try {
            const {email, username , password}=req.body
            if(!email || !username || !password){
                return res.status(400).json({
                    message:'',
                    status:false
                })
            }
            const existingUser =  await User.findOne({email})
            if(!existingUser){
                return res.status(400).json({
                    message:'',
                    status:false
                })
            }
          const user =   await User.create({

            })

            res.status(200).json({
                message:'',
                status:true,
                data:user
            })
        } catch (error) {
            
        }
    }
}