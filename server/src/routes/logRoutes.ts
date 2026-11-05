import { Router } from "express";
import { SecurityLog } from "../types/securityLog";
import { validateAPIKey } from "../middlewares/validateAPIKey";
import { uploadLog } from "../controllers/uploadController";

const router = Router();


const logs: SecurityLog[] = [
    { id : 2, sourceIp : "10.0.0.1", eventType : "LOGIN", severity: "low", timestamp: "2026-10-28T10:15:30Z" },
    { id : 5, sourceIp : "10.0.0.2", eventType : "LOGOUT", severity: "low", timestamp: "2026-10-28T14:32:45Z" },
    { id : 10, sourceIp : "10.0.0.3", eventType : "VIEW_DASHBOARD", severity: "low", timestamp: "2026-10-28T18:05:12Z" }
]

router.get("/", validateAPIKey,  (req, res) => {
    res.status(200).json(logs)
})

router.get("/:id",validateAPIKey, (req, res) => {
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

router.post("/upload", uploadLog)

export default router;