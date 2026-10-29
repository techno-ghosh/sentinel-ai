import SecurityLogCard from "../components/SecurityLogCard";
import { useEffect, useState } from "react";
import type { SecurityLog } from "../types/SecurityLog";


function Dashboard() {

    const [logs, setLogs] = useState<SecurityLog[]>([]);

    useEffect(() => {
       
        async function fetchLogs() {
            const response = await fetch("/api/logs",{
                    headers : {
                        "x-api-key" : "sentinel123"
                    }
                });
                const data = await response.json();
                setLogs(data);
        }

        fetchLogs();

    },[])

    return(
        <>
            { logs.map(log => <SecurityLogCard 
                key={log.id} 
                sourceIp={log.sourceIp}
                severity={log.severity} 
                eventType={log.eventType}
                />) }
        </>
       
    );
}

export default Dashboard;