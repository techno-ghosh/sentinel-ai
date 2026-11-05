import { Request, Response } from "express";
import busboy from "busboy";

export function uploadLog(req: Request, res: Response) {

    const bb = busboy({
        headers : req.headers,
        limits : {
            fileSize: 10 * 1024 * 1024,
            files : 1 // only one file can be uploaded at a time
        }
    });

    let uploadError: "invalid_type" | "too_large" | "too_many_files" | "invalid_field" | null = null;
    let fileReceived = false;

    bb.on("file", (fieldName, file, info) => {
        console.log("Received file: ", info.filename);

        if(fieldName !== "file") {
            uploadError = "invalid_field";
        }

        fileReceived = true;
        const allowedExtensions = [".log", ".txt"];
        const isAllowed = allowedExtensions.some(extension => info.filename?.toLowerCase().endsWith(extension))
        if(!isAllowed && uploadError === null) 
            {
                uploadError = "invalid_type"
            };


        file.on("limit",()=> {
            uploadError = "too_large";
        })

        file.resume();
    })

    bb.on("filesLimit", ()=> {
        if(uploadError === null) {
            uploadError = "too_many_files";
        }
    })

    bb.on("close", ()=> {
        
        if(uploadError === "too_large") {
           return res.status(413).json({
                error: "File limit exceeds 10MB limit"
            })
        }

        if(uploadError === "invalid_type") {
           return res.status(400).json({
                error: "File type unsupported"
            })
        }

        if(fileReceived === false) {
            return res.status(400).json({
                error: "No file uploaded"
            })
        }

        if(uploadError === "too_many_files") {
            return res.status(400).json({
                error: "Only one file is allowed"
            })
        }

        if(uploadError === "invalid_field") {
            return res.status(400).json({
                error: "Invalid file field name"
            })
        }


        res.status(200).json({
            message : "File uploaded successfully"
        })

    })

    req.pipe(bb);

}