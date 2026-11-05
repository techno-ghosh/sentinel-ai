import type { Request, Response, NextFunction } from "express";

export function validateAPIKey(req: Request, res: Response, next: NextFunction) {
    
    
        if(req.headers['x-api-key'] !== "sentinel123") {
            return res.status(401).json({
                message : "Unauthorized"
            })
        } else {
            next();
        } 
    
}