export interface SSHLogEvent {
    rawLog: string;
    eventType: "SSH_LOGIN_FAILED" | "SSH_LOGIN_SUCCESS" | "UNKNOWN";
    sourceIp?: string;
    username?: string;
    timestamp?: string;
    sourcePort?: number;
    hostname?: string;
    processId?: number;
    protocol?: string;
}