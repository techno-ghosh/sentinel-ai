import { useState } from "react";
import { MAX_FILE_SIZE } from "../constants/upload";



function LogFileUpload() {
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            <button>Upload File</button>
            { selectedFile && <p>{selectedFile.name}</p> }
        </section>
    )
}


export default LogFileUpload;