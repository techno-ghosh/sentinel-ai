import { useState } from "react";
import { MAX_FILE_SIZE } from "../constants/upload";
import { apiPost } from "../services/api";



function LogFileUpload() {
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleFileChange(file: File): boolean {
        if(file.size > MAX_FILE_SIZE) {
            alert("File Size Exceeds 10 MB limit")
            setSelectedFile(null);
            return false;
        } 

        const allowedExtensions = [".log", ".txt"];
        const isAllowed = allowedExtensions.some(extension =>
            file.name.toLowerCase().endsWith(extension)
        );

        if(!isAllowed) {
            alert("Unsupported File Type")
            setSelectedFile(null)
            return false;
        }

        setSelectedFile(file)
        return true;
    }

    async function uploadFile() {
        if(selectedFile === null) return;
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file",selectedFile);

            await apiPost<unknown>("/api/logs/upload",formData);
            setSuccessMessage("File Uploaded Successfully");
        } catch(error) {

            (error instanceof Error) ? setErrorMessage(error.message) : setErrorMessage("File Upload Failed")
        
        } finally {
            setIsUploading(false);
        }

        
    }


    return (
        <section>
            <h1>Upload Security Logs</h1>
            <input type="file" onChange={(event) => {
                const file = event.target.files?.[0];
                if(file) {
                     const fileUploadStatus = handleFileChange(file);
                     if(fileUploadStatus === false) 
                        { event.target.value = "" }
                    } 
            }} />
            <button onClick={uploadFile} disabled={selectedFile === null || isUploading}>{ isUploading ? "Uploading" : "Upload File"}</button>
            { selectedFile && <p>{selectedFile.name}</p> }
            { successMessage && <p>{successMessage}</p> }
            { errorMessage && <p>{errorMessage}</p> }

        </section>
    )
}


export default LogFileUpload;