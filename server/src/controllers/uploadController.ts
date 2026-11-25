import { Request, Response } from "express";
import busboy from "busboy";
import { parseSSHLog } from "../parsers/sshParser";
import { SSHLogEvent } from "../types/SSHLogEvent";
import { detectBruteForce } from "../services/bruteForceDetection";

export function uploadLog(req: Request, res: Response) {

    const contentType = req.headers["content-type"];

    if (contentType?.split(";")[0].trim().toLowerCase() !== "multipart/form-data") {
        return res.status(415).json({
            error: "Content type must be multipart/form-data"
        });
    }

    let bb: ReturnType<typeof busboy>;

    try {

         bb = busboy({
                headers : req.headers,
                limits : {
                    fileSize: 10 * 1024 * 1024 + 1,
                    files : 1 // only one file can be uploaded at a time
                }
            });

    } catch(error) {
        console.log(error)
        return res.status(400).json({
            error: "Invalid multipart request"
        })
    }

    let uploadError: "invalid_type" | "too_large" | "too_many_files" | "invalid_field" | "malformed_request" | null = null;
    let fileReceived = false;
    let uploadInterrupted = false;
    let logYear: string | undefined;
    let timezoneOffset: string | undefined;
    let invalidMetadata = false;
    const parsedEvents: SSHLogEvent[] = [];

    bb.on("field", (name, value, info) => {
    if (info.valueTruncated) {
        invalidMetadata = true;
    }

    if (name === "year") {
        if (logYear !== undefined) invalidMetadata = true;
        logYear = value;
    }

    if (name === "timezoneOffset") {
        if (timezoneOffset !== undefined) invalidMetadata = true;
        timezoneOffset = value;
    }
    });

    bb.on("file", (fieldName, file, info) => {
        console.log("Received file: ", info.filename);
        let fileContent: string = "";

        if(fieldName !== "file" && uploadError === null) {
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

        file.on("end",() => {
                    if(file.truncated) {
                            uploadError = "too_large";
                        }
                if(uploadError !== null) {
                    return;
                }
                const lines = fileContent.split(/\r?\n/).filter(line => line !== "");
                lines.forEach(line => {
                    parsedEvents.push(parseSSHLog(line));
                })
        })

        file.on("error", (error: Error)=> {
            console.error("File Stream Error: ", error);

            if(!uploadInterrupted) {
                uploadError = "malformed_request";
            }
        })

        file.on("data",(chunk: Buffer) => {
            
            fileContent+= chunk.toString();
        })

        // file.resume();
    })

    bb.on("filesLimit", ()=> {

        if(uploadError !== "too_large") {
            uploadError = "too_many_files";
        }
    })

    bb.on("error",(error: Error)=>{
            uploadError = "malformed_request";
            console.error("Multipart parsing error: ",error.message)
        })

    bb.on("close", ()=> {

        if(uploadInterrupted || res.headersSent || res.destroyed) {
            return;
        }

        if(uploadError === "malformed_request") {
            return res.status(400).json({
                error: "Malformed multipart request"
            })
        }
        
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

        const hasContext =
        logYear !== undefined || timezoneOffset !== undefined;

        if (
            invalidMetadata ||
            (hasContext && (
                !logYear ||
                !/^\d{4}$/.test(logYear) ||
                Number(logYear) < 1 ||
                !timezoneOffset ||
                !/^(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(timezoneOffset)
            ))
        ) {
            return res.status(400).json({
                error: "Invalid timestamp metadata"
            });
        }

        const context =
            logYear !== undefined && timezoneOffset !== undefined
                ? {
                    year: Number(logYear),
                    timezoneOffset
                }
                : undefined;

        try {
        
        const {alerts, skippedTimestamps} = detectBruteForce(parsedEvents, {
            threshold: 5,
            windowSeconds: 60
        }, context);

        return res.status(200).json({
            message : "File uploaded and parsed successfully",
            totalEvents: parsedEvents.length,
            events: parsedEvents,
            totalAlerts: alerts.length,
            alerts,
            skippedTimestamps
        })

        } catch(error) {
            console.error("Brute-force detection failed:", error);
            return res.status(500).json({
                "error": "Failed to analyze uploaded logs"
            })

        }


    })

    req.on("close", ()=> {
        if(req.complete === false) {
            uploadInterrupted = true;
            console.error("Upload interrupted")
            req.unpipe(bb);
            bb.destroy();
        }
    })

    req.pipe(bb);

}