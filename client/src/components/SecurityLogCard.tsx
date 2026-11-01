import { useState } from "react";


interface SecurityLogCardProps {
    id: number;
    sourceIp: string;
    severity: string;
    eventType: string;
    onCardClick: (id: number) => void;
}




function SecurityLogCard({ id,sourceIp,severity,eventType,onCardClick }: SecurityLogCardProps) {
    
    const [showDetails, setShowDetails] = useState(false);
    console.log(showDetails)
    return (
        <article className="security-log-card">
        <button onClick={() => setShowDetails(!showDetails)}> {showDetails ? "Hide details" : "Show Details" } </button>
        <button onClick={() =>onCardClick(id)}>Select Log</button>
        { showDetails && <div>
            <h2>Security Log</h2>
            <p>Source IP: {sourceIp}</p>
            <p>Severity: {severity}</p>
            <p>EventType: {eventType}</p>
        </div> }
        
       </article>
    );

}

export default SecurityLogCard;