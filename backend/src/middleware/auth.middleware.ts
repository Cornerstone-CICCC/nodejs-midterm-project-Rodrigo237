import { Request, Response, NextFunction } from "express";

export const checkLogin = (req:Request,res:Response,next:NextFunction) => {
    if(!req.session || !req.session.username){
        res.status(401).json({
            message: "Unauthorized! Please log in."
        })
        return
    }
    next();
}

export const checkLogout = (req:Request,res:Response,next:NextFunction) => {
    if(req.session && req.session.username){
        res.status(400).json({
            message: "You are already logged in!"
        })
        return
    }
    next();
}