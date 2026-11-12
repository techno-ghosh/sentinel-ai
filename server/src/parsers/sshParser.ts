import { SSHLogEvent } from "../types/SSHLogEvent";


export function parseSSHLog(sshLog: string):SSHLogEvent {

    
    const headerPattern = /^([A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+sshd\[(\d+)\]:\s*/;
    const headerMatch = sshLog.match(headerPattern);
    if(headerMatch === null) {
        return {
            rawLog : sshLog,
            eventType : "UNKNOWN"
        }
    }

    const timestamp: SSHLogEvent["timestamp"] = headerMatch[1];
    const hostname: SSHLogEvent["hostname"] = headerMatch[2];
    const processId: SSHLogEvent["processId"] = Number(headerMatch[3]);
    const message: string = sshLog.slice(headerMatch[0].length)

    const failedLoginPattern = /^Failed password for (?:invalid user )?(\S+) from (\S+) port (\d+) (ssh\d+)$/;
    const successfulLoginPattern = /^Accepted (?:password|publickey) for (\S+) from (\S+) port (\d+) (ssh\d+)$/;
    const failedLoginMatch = message.match(failedLoginPattern)
    if( failedLoginMatch !== null) {
        return {
            rawLog: sshLog,
            eventType: "SSH_LOGIN_FAILED",
            timestamp,
            hostname: hostname,
            processId: processId,
            username: failedLoginMatch[1],
            sourceIp: failedLoginMatch[2],
            sourcePort: Number(failedLoginMatch[3]),
            protocol: failedLoginMatch[4]
        }
    }

    const successfulLoginMatch = message.match(successfulLoginPattern);
    if(successfulLoginMatch !== null) {
        return {
            rawLog: sshLog,
            eventType: "SSH_LOGIN_SUCCESS",
            timestamp,
            hostname: hostname,
            processId: processId,
            username: successfulLoginMatch[1],
            sourceIp: successfulLoginMatch[2],
            sourcePort: Number(successfulLoginMatch[3]),
            protocol: successfulLoginMatch[4]
        }
    }
    return {
        rawLog: sshLog,
        eventType : "UNKNOWN",
        timestamp,
        hostname,
        processId
    }

}