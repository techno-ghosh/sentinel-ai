import { SSHLogEvent } from "../types/SSHLogEvent";
import { normalizeTimestamp, TimestampContext } from "../utils/timestampNormalizer";

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

export interface BruteForceResult {
    alerts: BruteForceAlert[];
    skippedTimestamps: number;
}

export function detectBruteForce(events: SSHLogEvent[], config: BruteForceConfig, context?: TimestampContext): BruteForceResult {

    if(!Number.isInteger(config.threshold) || config.threshold <= 0) {
        throw new RangeError("Invalid threshold value")
    }
    if(!Number.isFinite(config.windowSeconds) || config.windowSeconds <= 0) {
        throw new RangeError("Invalid window seconds value")
    }

    const alerts: BruteForceAlert[] = [];
    let skippedTimestamps = 0;

    const attemptsByIp = new Map<string, SSHLogEvent[]>();

    for(let event of events) {
        
        if(event.eventType !== "SSH_LOGIN_FAILED" || !event.sourceIp) {
            continue;
        }
        if(!event.timestamp) {
            skippedTimestamps++;
            continue;
        }

        if(!attemptsByIp.has(event.sourceIp)) {
            attemptsByIp.set(event.sourceIp, [])
        }
        attemptsByIp.get(event.sourceIp)?.push(event);
        

    }


    for(const [sourceIp, ipEvents] of attemptsByIp) {
        const timestamps = ipEvents
        .map(event => {
            if (!event.timestamp) {
                return null;
            }

            const normalizedTimestamp = normalizeTimestamp(event.timestamp, context);
            if(normalizedTimestamp === null ) {
                skippedTimestamps++;
                return normalizedTimestamp;
            }

            return normalizedTimestamp
        })
        .filter((timestamp): timestamp is number => timestamp !== null)
        .sort((a, b) => a - b);
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
    
    


     return {
        alerts,
        skippedTimestamps
     };

}