import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
const port: number = 3000;

interface SecurityLog {
    id: number;
    sourceIp: string;
    eventType: string;
    severity: "low" | "medium" | "high";
    timestamp: string
}

const logs: SecurityLog[] = [
    { id : 2, sourceIp : "10.0.0.1", eventType : "LOGIN", severity: "low", timestamp: "2026-10-28T10:15:30Z" },
    { id : 5, sourceIp : "10.0.0.2", eventType : "LOGOUT", severity: "low", timestamp: "2026-10-28T14:32:45Z" },
    { id : 10, sourceIp : "10.0.0.3", eventType : "VIEW_DASHBOARD", severity: "low", timestamp: "2026-10-28T18:05:12Z" }
]

function validateAPIKey(req: Request, res: Response, next: NextFunction) {
    
    
        if(req.headers['x-api-key'] !== "sentinel123") {
            return res.status(401).json({
                message : "Unauthorized"
            })
        } else {
            next();
        } 
    
}

app.get('/api/health', (req, res) =>{
    res.status(200).json({
        status: "ok",
        service: "SentinelAI API"
    })
})


app.get("/api/logs", validateAPIKey,  (req, res) => {
    res.status(200).json(logs)
})

app.get("/api/logs/:id",validateAPIKey, (req, res) => {
    const id: number = Number(req.params.id);
    const log = logs.find(item => item.id === id);
    if(!log) {
       return res.status(404).json({
            message : "Log not found"
        })
    } 
       return res.status(200).json({
            message: "Log found",
            log : log
        })
    
})

app.listen(port, ()=> {
    console.log("Sentinel AI API is running")
})