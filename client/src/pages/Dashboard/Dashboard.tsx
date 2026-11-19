import LogFileUpload from "../../components/LogFileUpload/LogFileUpload";
import { useState } from "react";
import type { SSHLogEvent } from "../../types/SSHLogEvent";
import { SSHEventCard } from "../../components/SSHEventCard/SSHEventCard";
import { SSHEventMobileCard } from "../../components/SSHEventMobileCard/SSHEventMobileCard";
import "./Dashboard.css";
import { SecurityLogFilters } from "../../components/SecurityLogFilters/SecurityLogFilters";
import type { SSHEventTypeFilter } from "../../types/SSHEventTypeFilter";

function Dashboard() {

  
    const [sshEvents, setSSHEvents] = useState<SSHLogEvent[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [eventTypeFilter, setEventTypeFilter] = useState<SSHEventTypeFilter>("ALL");


    function handleUploadSuccess(events: SSHLogEvent[]) {
        setSSHEvents(events);
    }

    function handleResetFilters() {
        setSearchQuery("");
        setEventTypeFilter("ALL");
    }

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const filteredEvents = sshEvents.filter((event)=> {
        const matchesEventType = eventTypeFilter === "ALL" || eventTypeFilter === event.eventType
        const matchesSearch = (event.sourceIp ?? "").toLowerCase().includes(normalizedSearchQuery) || (event.username ?? "").toLowerCase().includes(normalizedSearchQuery);
        return matchesEventType && matchesSearch;
    })

    return(
        <main className="dashboard">
            <h1>Sentinel AI Dashboard</h1>
            <p>Security Event Monitoring</p>
            <section className="log-list">

                    <LogFileUpload  onUploadSuccess={handleUploadSuccess}/>
            </section>
            <section className="security-logs-panel">
                <h2>Recent Security Logs</h2>
                <SecurityLogFilters 
                    searchQuery={searchQuery} 
                    onSearchChange={setSearchQuery}  
                    eventTypeFilter={eventTypeFilter}
                    onEventTypeFilterChange={setEventTypeFilter}
                    onResetFilters={handleResetFilters}
                    />
                { sshEvents.length === 0 && <p>No security logs uploaded yet. Upload a .log or .txt file to begin.</p>  }
                { (sshEvents.length > 0 && filteredEvents.length === 0) && (<p>No Logs to show.</p>) }
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
                        { filteredEvents.map((event,index) => (
                            <SSHEventCard 
                                    key={index} 
                                    event={event}/>
                            ))}
                    </tbody>
                </table>
                </div>
                <div className="security-logs-mobile">
                    {
                        filteredEvents.map((event,index) =>(
                            <SSHEventMobileCard event={event} key={index}/>
                        ))
                    }
                </div>


                
            </section>
            
        </main>
       
    );
}

export default Dashboard;