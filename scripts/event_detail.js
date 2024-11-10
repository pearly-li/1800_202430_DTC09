function structureDate(month, day) {
    var ordinal = "th"
    if (day in [1, 21, 31]) {
        ordinal = "st"
    } else if (day in [2, 22]) {
        ordinal = "nd"
    } else if (day in [3, 23]) {
        ordinal = "rd"
    }

    monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    month = monthNames[month]
    date = `${month} ${day}${ordinal}`;

    return date
}


function createEventDetail() {
    let params = new URL(window.location.href);
    let eventID = params.searchParams.get("docID")
    
    db.collection("events")
    .doc(eventID)
    .get()
    .then(eventInfo => {
        var title = eventInfo.data().title;
        var location = eventInfo.data().location;
        var description = eventInfo.data().description;
        var scale = eventInfo.data().scale;
        var image = eventInfo.data().image;
        var date = new Date(`${eventInfo.data().date}, ${eventInfo.data().time}`);

        // Code to display time
        var event_hour = date.getHours()
        var event_minute = date.getMinutes()
        var timeSuffix = "AM"
        if (event_hour == 0) {
            event_hour = 12
        } else if (event_hour > 12) {
            event_hour -= 12
            timeSuffix = "PM"
        }
        var time = `${event_hour}:${event_minute} ${timeSuffix}`

        // Code to display date
        var month = date.getMonth();
        var day = date.getDate();

        var today = new Date();
        var currentYear = today.getFullYear();
        var currentMonth = today.getMonth();

        maxDays = 31
        if (currentMonth in [4, 6, 9, 11]) {
            maxDays = 30;
        } else if (currentYear % 4 == 0) {
            maxDays = 29
        } else if (currentMonth == 2) {
            maxDays = 28
        }

        date = structureDate(month, day);
        
        document.getElementById('eventImg').src = image;
        document.getElementById('eventTitle').innerText = title;
        document.getElementById('eventDescription').innerText = description;
        document.getElementById('eventParticipation').innerText = scale;
        document.getElementById('eventAddress').innerText = location;
        document.getElementById('eventTime').innerText = date + ", " + time;
    })  
}
createEventDetail()

pressLike = 1
function fillLike() {
    if (pressLike == 1) {
        document.getElementById('like').src = "./images/f_heart.png"
        pressLike--;
    }
    else {
        document.getElementById('like').src = "./images/heart.png"
        pressLike++;
    }
}

pressAttend = 1
function attendEvent(userID) {
    if (pressAttend == 1) {
        document.getElementById('attendBtn').innerText = "Cancle"
        pressAttend--;
    }
    else {
        document.getElementById('attendBtn').innerText = "Attend"
        pressAttend++;
    }
}

like_btn = document.getElementById("likeBtn")
like_btn.addEventListener("click", () => {
    fillLike();
})

attend_btn = document.getElementById("attendBtn")
attend_btn.addEventListener("click", () => {
    attendEvent(userID);
})