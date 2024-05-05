export const getDateAsUnixTime = (date: Date) => {
    return date.getTime()
}

export function getDaysBetweenDates(date1: Date, date2: Date): number {
    // Calculate the difference in time between the two dates
    const timeDifference = date2.getTime() - date1.getTime();

    // Convert time difference to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}

export function getHoursBetweenDates(date1: Date, date2: Date): number {
    // Calculate the difference in time between the two dates
    const timeDifference = date2.getTime() - date1.getTime();

    // Convert time difference to hours
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

    return hoursDifference;
}