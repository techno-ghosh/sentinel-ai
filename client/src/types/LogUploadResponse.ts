import type { SecurityEvent } from "./SecurityEvent";

export interface LogUploadResponse<T extends SecurityEvent> {
    message: string;
    totalEvents: number;
    events: T[];
}