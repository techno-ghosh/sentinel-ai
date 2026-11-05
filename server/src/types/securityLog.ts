export interface SecurityLog {
    id: number;
    sourceIp: string;
    eventType: string;
    severity: "low" | "medium" | "high";
    timestamp: string
}