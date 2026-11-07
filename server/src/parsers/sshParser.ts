import { SSHLogEvent } from "../types/SSHLogEvent";


export function parseSSHLog(sshLog: string):SSHLogEvent | null {

    const normalizeLog = sshLog.toLowerCase()
    let eventType: SSHLogEvent["eventType"];
    let sourceIp: SSHLogEvent["sourceIp"];
    if(normalizeLog.includes("failed password")) {
        eventType = "SSH_LOGIN_FAILED";
        let parts = normalizeLog.split("from ");
        if(parts.length > 1) {
            sourceIp = parts[1].split(" ")[0];
        } else {
            return null;
        }

    } else {
        return null;
    }

    return {
         eventType,
         sourceIp
    }

}