function getDateList(date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
    }
}

function compareDates(today, eventDate) {
    if (eventDate.year > today.year) {
        return true;
    } else if (eventDate.year == today.year && eventDate.month > today.month) {
        return true;
    } else if (eventDate.month == today.month && eventDate.day > today.day) {
        return true;
    } else if (eventDate.day == today.day && eventDate.hour > today.hour) {
        return true;
    } else if (eventDate.hour == today.hour && eventDate.minute > today.minute) {
        return true;
    } else {
        return false;
    }
}

function checkIfTodayOrTomorrow(today, eventDate) {
    maxDays = 31
    if (today.month in [4, 6, 9, 11]) {
        maxDays = 30;
    } else if (today.year % 4 == 0) {
        maxDays = 29
    } else if (today.month == 2) {
        maxDays = 28
    }

    var tomorrowDay = today.day + 1;
    var tomorrowMonth = today.month;
    var tomorrowYear = today.year;
    if (tomorrowDay > maxDays) {
        tomorrowDay = 1;
        tomorrowMonth += 1;
    }
    if (tomorrowMonth > 11) {
        tomorrowMonth = 0;
        tomorrowYear += 1;
    }

    if (today.year === eventDate.year && today.month === eventDate.month && today.day === eventDate.day) {
        return "Today";
    } else if (tomorrowYear === eventDate.year && tomorrowMonth === eventDate.month && tomorrowDay === eventDate.day) {
        return "Tomorrow";
    } else {
        return formatDate(eventDate)
    }
}

function formatDate(eventDate) {
    var ordinal = "th"
    if (eventDate.day in [1, 21, 31]) {
        ordinal = "st"
    } else if (eventDate.day in [2, 22]) {
        ordinal = "nd"
    } else if (eventDate.day in [3, 23]) {
        ordinal = "rd"
    }

    monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    month = monthNames[eventDate.month]
    date = `${month} ${eventDate.day}${ordinal}`;

    return date
}

function formatTime(eventDate) {
    var timeSuffix = "AM"

    if (eventDate.hour == 0) {
        eventDate.hour = 12
    } else if (eventDate.hour > 12) {
        eventDate.hour -= 12
        timeSuffix = "PM"
    }

    if (eventDate.minute < 10) {
        eventDate.minute = "0" + eventDate.minute
    }

    return `${eventDate.hour}:${eventDate.minute} ${timeSuffix}`
}