import SecurityLogCard from "../components/SecurityLogCard";
import { useEffect, useState } from "react";
import type { SecurityLog } from "../types/SecurityLog";
import { apiGet } from "../services/api";

function Dashboard() {

    const [logs, setLogs] = useState<SecurityLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);
    const [selectedLogId, selectLog] = useState<number|null>(null);


    function handleCardClick(id: number) {
        console.log("Card Clicked "+id)

        selectLog(id===selectedLogId ? null : id)

    }

    useEffect(() => {
       
        
        async function fetchLogs() {

            try {
                const data = await apiGet<SecurityLog[]>("/api/logs");
                setLogs(data);
            } catch(error) {
                console.error(error);
                setError("Failed to load error logs, Please try again");
            } finally {
                setLoading(false);
            }
                
        }

        fetchLogs();

    },[])

    return(
        <main className="dashboard">
            <h1>Sentinel AI Dashbaord</h1>
            <p>Security Event Monitoring</p>
            { selectedLogId !== null ? <p>Selected Log Id : {selectedLogId}</p> : <p>No Log Selected</p> } 
            { loading && <p>Loading Security Logs...</p> }
            { error && <p> {error} </p> }
            { (!error && !loading && logs.length === 0) && <p>No security logs available.</p> }
            <section className="log-list">
                { logs.map(log => (<SecurityLogCard 
                    id={log.id}
                    key={log.id} 
                    sourceIp={log.sourceIp}
                    severity={log.severity} 
                    eventType={log.eventType}
                    onCardClick={handleCardClick}
                    />)) }
            </section>
            
        </main>
       
    );
}

export default Dashboard;