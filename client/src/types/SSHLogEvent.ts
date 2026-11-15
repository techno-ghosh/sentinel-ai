import type { SecurityEvent } from "./SecurityEvent";

export interface SSHLogEvent extends SecurityEvent {
    eventType: "SSH_LOGIN_FAILED" | "SSH_LOGIN_SUCCESS" | "UNKNOWN";
    username?: string;
    sourcePort?: number;
    processId?: number;
    protocol?: string;
}