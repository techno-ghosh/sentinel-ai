import type { SSHLogEvent } from "../../types/SSHLogEvent";
import { formatSSHEventType, getSSHEventResult } from "../../utils/getSSHEventResult";
import "./SSHEventMobileCard.css"
interface SSHEventMobileCardProps {
    event: SSHLogEvent
}

export function SSHEventMobileCard({event}: SSHEventMobileCardProps) {

   const result = getSSHEventResult(event.eventType);
    return (
        <div className="ssh-mobile-card">
            <div className="ssh-mobile-card-header">
                <p>{formatSSHEventType(event.eventType)}</p>
                <span className={`${result.toLowerCase()}-box`}>
                 {result}
            </span>
            </div>
            
            <p className="ssh-mobile-timestamp">Timestamp: {event.timestamp ?? "N/A" }</p>
            <hr className="ssh-mobile-divider" />
            <div className="ssh-mobile-detail-row">
                <span>Source IP</span>
                <span>{event.sourceIp ?? "N/A"}</span>
            </div>
            <div className="ssh-mobile-detail-row">
                <span>Username</span>
                <span>{event.username ?? "N/A"}</span>
            </div>
        </div>
    );

} 