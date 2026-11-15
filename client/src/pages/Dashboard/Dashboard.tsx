import LogFileUpload from "../../components/LogFileUpload/LogFileUpload";
import { useState } from "react";
import type { SSHLogEvent } from "../../types/SSHLogEvent";
import { SSHEventCard } from "../../components/SSHEventCard/SSHEventCard";
import { SSHEventMobileCard } from "../../components/SSHEventMobileCard/SSHEventMobileCard";
import "./Dashboard.css";

function Dashboard() {

  
    const [sshEvents, setSSHEvents] = useState<SSHLogEvent[]>([]);


    function handleUploadSuccess(events: SSHLogEvent[]) {
        setSSHEvents(events);
    }

    return(
        <main className="dashboard">
            <h1>Sentinel AI Dashboard</h1>
            <p>Security Event Monitoring</p>
            <section className="log-list">

                    <LogFileUpload  onUploadSuccess={handleUploadSuccess}/>
            </section>
            <section className="security-logs-panel">
                <h2>Recent Security Logs</h2>
                { sshEvents.length === 0 && <p>No security logs uploaded yet. Upload a .log or .txt file to begin.</p>  }
                <div className="security-logs-table-wrapper">
                <table className="security-logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Event Type</th>
                            <th>Source IP</th>
                            <th>Username</th>
                            <th>Hostname</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        { sshEvents.map((event,index) => (
                            <SSHEventCard 
                                    key={index} 
                                    event={event}/>
                            ))}
                    </tbody>
                </table>
                </div>
                <div className="security-logs-mobile">
                    {
                        sshEvents.map((event,index) =>(
                            <SSHEventMobileCard event={event} key={index}/>
                        ))
                    }
                </div>

                
            </section>
            
        </main>
       
    );
}

export default Dashboard;