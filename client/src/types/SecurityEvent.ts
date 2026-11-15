export interface SecurityEvent {
    rawLog: string;
    eventType: string;
    timestamp?: string;
    sourceIp?: string;
    hostname?: string;
}