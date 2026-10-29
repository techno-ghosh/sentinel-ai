import { useState } from "react";


interface SecurityLogCardProps {
    sourceIp: string;
    severity: string;
    eventType: string;
}




function SecurityLogCard({ sourceIp,severity,eventType }: SecurityLogCardProps) {
    
    const [showDetails, setShowDetails] = useState(false);
    console.log(showDetails)
    return (
        <>
        <button onClick={() => setShowDetails(!showDetails)}> {showDetails ? "Hide details" : "Show Details" } </button>
        { showDetails && <div>
            <h2>Security Log</h2>
            <p>Source IP: {sourceIp}</p>
            <p>Severity: {severity}</p>
            <p>EventType: {eventType}</p>
        </div> }
        
       </>
    );

}

export default SecurityLogCard;