function getDateList(date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
    }
}

function compareIfTodayOrLater(today, eventDate) {
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

function compareIfYesterdayOrOlder(yesterday, eventDate) {
    if (eventDate.year < yesterday.year) {
        return true;
    } else if (eventDate.year == yesterday.year && eventDate.month < yesterday.month) {
        return true;
    } else if (eventDate.month == yesterday.month && eventDate.day < yesterday.day) {
        return true;
    } else if (eventDate.day == yesterday.day && eventDate.hour < yesterday.hour) {
        return true;
    } else if (eventDate.hour == yesterday.hour && eventDate.minute < yesterday.minute) {
        return true;
    } else {
        return false;
    }
}

function checkIfTodayOrTomorrowOrYesterday(today, tomorrow, yesterday, eventDate) {

    if (today.year === eventDate.year && today.month === eventDate.month && today.day === eventDate.day) {
        return "Today";
    } else if (tomorrow.year === eventDate.year && tomorrow.month === eventDate.month && tomorrow.day === eventDate.day) {
        return "Tomorrow";
    } else if (yesterday.year === eventDate.year && yesterday.month === eventDate.month && yesterday.day === eventDate.day) {
        return "Yesterday";
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

function formatTimeAgo(display, today, date) {
    if (display == "Yesterday" && (today.hour + 24 - date.hour + 24) < 24) {
        return `${today.hour + 24 - date.hour + 24} hour(s) ago`
    } else if (display == "Today" && today.hour > date.hour) {
        return `${today.hour - date.hour} hour(s) ago`
    } else if (display == "Today" && today.hour == date.hour && today.minute > date.minute) {
        return `${today.minute - date.minute} minute(s) ago`
    } else if (display == "Today" && today.hour == date.hour && today.minute == date.minute) {
        return "Just now"
    } else {
        formatTime(date)
    }
}