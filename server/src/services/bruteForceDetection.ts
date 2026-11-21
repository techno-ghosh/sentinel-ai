import { SSHLogEvent } from "../types/SSHLogEvent";

export interface BruteForceConfig {
    threshold: number;
    windowSeconds: number;
}

export interface BruteForceAlert {
    sourceIp: string;
    failedAttempts: number;
    startTime: string;
    endTime: string;
}

export function detectBruteForce(events: SSHLogEvent[], config: BruteForceConfig, logYear: number): BruteForceAlert[] {

    const alerts: BruteForceAlert[] = [];

    const attemptsByIp = new Map<string, SSHLogEvent[]>();

    for(let event of events) {

        if(event.eventType !== "SSH_LOGIN_FAILED" || !event.sourceIp || !event.timestamp) {
            continue;
        }

        if(!attemptsByIp.has(event.sourceIp)) {
            attemptsByIp.set(event.sourceIp, [])
        }
        attemptsByIp.get(event.sourceIp)?.push(event);

    }

    for(const [sourceIp, ipEvents] of attemptsByIp) {
        const timestamps = ipEvents.map(event =>{
            const timestamp = event.timestamp!; // the ! at the end is an assertion operator basically telling typescript, trust me, timestamp is not null or undefined.

            if (!/^\d{4}-\d{2}-\d{2}T/.test(timestamp)) {
                return NaN;
            }

            return Date.parse(timestamp)
        })
        .filter(Number.isFinite)
        .sort((a,b) => a - b)

        let left = 0;
        let alertGenerated = false;
        let activeAlert: BruteForceAlert | null = null;
        let episodeStart = 0;

        for (let right =0; right < timestamps.length; right++) {

                if (
                    right > 0 &&
                    timestamps[right] - timestamps[right - 1] > config.windowSeconds * 1000
                        ) {
                            left = right;
                            episodeStart = right;
                            alertGenerated = false;
                            activeAlert = null;
                        }

                        while (
                            timestamps[right] - timestamps[left] > config.windowSeconds * 1000
                        ) {
                            left++;
                        }

                        const count = right - left + 1;

                        if (count >= config.threshold && !alertGenerated) {
                            const alert: BruteForceAlert = {
                                sourceIp,
                                failedAttempts: right - episodeStart + 1,
                                startTime: new Date(timestamps[episodeStart]).toISOString(),
                                endTime: new Date(timestamps[right]).toISOString()
                            };

                            alerts.push(alert);
                            activeAlert = alert;
                            alertGenerated = true;
                        } else if (activeAlert) {
                            activeAlert.failedAttempts = right - episodeStart + 1;
                            activeAlert.endTime = new Date(timestamps[right]).toISOString();
                        }

        }

    }
    
    


     return alerts;

}