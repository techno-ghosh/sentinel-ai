import type { SSHEventTypeFilter } from "../../types/SSHEventTypeFilter";
import "./SecurityLogFilters.css"

interface SecurityLogFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    eventTypeFilter: SSHEventTypeFilter,
    onEventTypeFilterChange: (value: SSHEventTypeFilter) => void;
    onResetFilters: () => void;
}

export function SecurityLogFilters({searchQuery , onSearchChange, eventTypeFilter, onEventTypeFilterChange, onResetFilters}: SecurityLogFiltersProps) {

    return (
        <div className="security-log-filters">
            <input className="security-log-search" value={searchQuery} placeholder="Search by IP or username..." onChange={(event) => onSearchChange(event.target.value)}/>
            <select className="security-log-select" value={eventTypeFilter} onChange={(event) =>onEventTypeFilterChange(event.target.value as SSHEventTypeFilter)}>
                <option value="ALL">Show All</option>
                <option value="SSH_LOGIN_SUCCESS"> Successful Logins</option>
                <option value="SSH_LOGIN_FAILED">Failed Logins</option>
                <option value="UNKNOWN">Unknown Logs</option>

            </select>
            <button className="security-log-reset" onClick={onResetFilters}>Reset Filters</button>
        </div>
        
    )

}