import type { SSHLogEvent } from "../../types/SSHLogEvent";
import "./SSHEventCard.css";
import { formatSSHEventType, getSSHEventResult } from "../../utils/getSSHEventResult";

interface SSHEventCardProps {
    event: SSHLogEvent
}

export function SSHEventCard({event}: SSHEventCardProps) {

  
    const result = getSSHEventResult(event.eventType);
    return (
        <tr>
            <td>{event.timestamp ?? "N/A"}</td>
            <td>{formatSSHEventType(event.eventType) }</td>
            <td>{event.sourceIp ?? "N/A"}</td>
            <td>{event.username ?? "N/A"}</td>
            <td>{event.hostname ?? "N/A"}</td>
            <td>
                <span className={`${result.toLowerCase()}-box`} >
                    {result}    
                </span>
            </td>
        </tr>
    );

} 