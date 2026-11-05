import express from "express";
import { validateAPIKey } from "./middlewares/validateAPIKey";
import logRoutes from "./routes/logRoutes"

const app = express();
const port: number = 3000;

app.use("/api/logs",logRoutes);




app.get('/api/health', (req, res) =>{
    res.status(200).json({
        status: "ok",
        service: "SentinelAI API"
    })
})





app.listen(port, ()=> {
    console.log("Sentinel AI API is running")
})