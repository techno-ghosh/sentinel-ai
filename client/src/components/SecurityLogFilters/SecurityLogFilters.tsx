import type { SSHEventTypeFilter } from "../../types/SSHEventTypeFilter";

interface SecurityLogFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    eventTypeFilter: SSHEventTypeFilter,
    onEventTypeFilterChange: (value: SSHEventTypeFilter) => void;
}

export function SecurityLogFilters({searchQuery , onSearchChange, eventTypeFilter, onEventTypeFilterChange}: SecurityLogFiltersProps) {

    return (
        <div>
            <input value={searchQuery} placeholder="Search by IP or username..." onChange={(event) => onSearchChange(event.target.value)}/>
            <select value={eventTypeFilter} onChange={(event) =>onEventTypeFilterChange(event.target.value as SSHEventTypeFilter)}>
                <option value="ALL">Show All</option>
                <option value="SSH_LOGIN_SUCCESS"> Successfull Logins</option>
                <option value="SSH_LOGIN_FAILED">Failed Logins</option>
                <option value="UNKNOWN">Unknown Logs</option>

            </select>
        </div>
        
    )

}