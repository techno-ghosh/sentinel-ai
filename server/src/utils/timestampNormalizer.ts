export interface TimestampContext {
    year: number;
    timezoneOffset: string;
}

export function normalizeTimestamp(
    timestamp: string,
    context?:TimestampContext
):number | null {
    const isoPattern =
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$/;

    const isoMatch = timestamp.match(isoPattern);

    if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const hour = Number(isoMatch[4]);
    const minute = Number(isoMatch[5]);
    const second = Number(isoMatch[6]);

    if (
        year < 1 ||
        month < 1 || month > 12 ||
        day < 1 || day > 31 ||
        hour > 23 ||
        minute > 59 ||
        second > 59
    ) {
        return null;
    }

    const isLeapYear =
    year % 4 === 0 &&
    (year % 100 !== 0 || year % 400 === 0);

    const daysInMonth = [
        31, isLeapYear ? 29 : 28, 31, 30,
        31, 30, 31, 31, 30, 31, 30, 31
    ];

    if (day > daysInMonth[month - 1]) {
        return null;
    }

    const timezone = isoMatch[8];

    if (timezone !== "Z") {
        const offsetHour = Number(timezone.slice(1, 3));
        const offsetMinute = Number(timezone.slice(4, 6));

        if (offsetHour > 23 || offsetMinute > 59) {
            return null;
        }
    }

    const milliseconds = Date.parse(timestamp);

    return Number.isFinite(milliseconds)
        ? milliseconds
        : null;

        }

        const syslogPattern =
    /^([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})$/;

    const syslogMatch = timestamp.match(syslogPattern);

    if (syslogMatch && context) {
        const months = [
            "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"
        ];

        const month = months.indexOf(syslogMatch[1]) + 1;

        if (
            month === 0 ||
            !Number.isInteger(context.year) ||
            context.year < 1 ||
            context.year > 9999
        ) {
            return null;
        }

        const year = String(context.year).padStart(4, "0");
        const monthString = String(month).padStart(2, "0");
        const day = syslogMatch[2].padStart(2, "0");
        const time = syslogMatch[3];

        const isoTimestamp =
            `${year}-${monthString}-${day}T${time}${context.timezoneOffset}`;

        return normalizeTimestamp(isoTimestamp);
    
    
    }   

    return null;
}