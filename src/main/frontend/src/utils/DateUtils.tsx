export const getDateInCurrentUsersTimezone = (dateStr: string, serverTimezone: string)	=> {
    // Get timezone offsets
    // This gets the difference in ms between the server time and the users current location
    let nowAsStringInServerTimezone = new Date(dateStr).toLocaleString('en-US', {timeZone: serverTimezone});
    let serverTimestamp = new Date(nowAsStringInServerTimezone).getTime();
    let userTimestamp = new Date(dateStr).getTime();
    let offset = userTimestamp - serverTimestamp;

    // Get a unix timestamp for the server date and add the offset
    let adjustedTimestamp = new Date(dateStr).getTime() + offset;

    // Return a date object adjusted for the user's timezone
    return new Date(adjustedTimestamp);
}