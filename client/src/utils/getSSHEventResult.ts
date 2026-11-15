export function getSSHEventResult(eventType: string): string {
    switch(eventType) {
        case "SSH_LOGIN_FAILED" : return "Failed";
        case "SSH_LOGIN_SUCCESS" : return "Success";
        case "UNKNOWN" : return "Unknown";
        default: return "Unknown";
    }
}

export function formatSSHEventType(eventType: string): string {

    switch(eventType) {
        case "SSH_LOGIN_FAILED" : return "SSH Login Failed";
        case "SSH_LOGIN_SUCCESS" : return "SSH Login Success";
        case "UNKNOWN" : return "Unknown";
        default: return "Unknown";
    }
        
}