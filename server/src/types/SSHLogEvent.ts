export interface SSHLogEvent {
    eventType: "SSH_LOGIN_FAILED" | "SSH_LOGIN_SUCCESS";
    sourceIp: string;
    username?: string;
}