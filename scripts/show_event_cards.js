function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            showLikedPosts(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

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

function displayEventCards() {
    let cardTemplate = document.getElementById("event_card_template");

    db.collection("events")
        .get()
        .then(allEvents => {
            allEvents.forEach(doc => {
                var dateTime = new Date(doc.data().dateTime);
                var dateEachComponent = getDateList(dateTime)
                var today = new Date();
                var todayEachComponent = getDateList(today)

                if (compareDates(todayEachComponent, dateEachComponent)) {
                    var title = doc.data().title;
                    var image = doc.data().image
                    var docID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true);

                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent);
                    newCard.querySelector(".event_card_time").innerHTML = formatTime(dateEachComponent);
                    newCard.querySelector('img').src = image;
                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                    if (document.getElementById("browsing_list"))
                        document.getElementById("browsing_list").appendChild(newCard);
                }
            })
        })
}
displayEventCards()

function displayUpcomingEventCards() {
    let cardTemplate = document.getElementById("event_card_template");

    db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents => {
            allEvents.forEach(doc => {
                var dateTime = new Date(doc.data().dateTime);
                var dateEachComponent = getDateList(dateTime)
                var today = new Date();
                var todayEachComponent = getDateList(today)

                dateTime = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent)
                if (compareDates(todayEachComponent, dateEachComponent) && (dateTime == "Today" || dateTime == "Tomorrow")) {
                    var title = doc.data().title;
                    var image = doc.data().image
                    var docID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true);

                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = dateTime;
                    newCard.querySelector(".event_card_time").innerHTML = formatTime(dateEachComponent);
                    newCard.querySelector('img').src = image;
                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                    if (document.getElementById("upcoming_browsing_list"))
                        document.getElementById("upcoming_browsing_list").appendChild(newCard);
                }
            })
        })
}
displayUpcomingEventCards()

function showLikedPosts(user) {
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {
            // Get the Array of likePosts
            var likes = userDoc.data().likePosts;
            console.log(likes);

            // Get pointer the new card template
            let cardTemplate = document.getElementById("event_card_template");

            // Iterate through the ARRAY of liked events (document ID's)
            likes.forEach(thisEventID => {
                console.log(thisEventID);
                db.collection("events").doc(thisEventID).get().then(doc => {
                    var dateTime = new Date(doc.data().dateTime); 
                    var dateEachComponent = getDateList(dateTime)
                    var today = new Date();
                    var todayEachComponent = getDateList(today)

                    var title = doc.data().title; 
                    var image = doc.data().image; 
                    var docID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true);

                    //update title and some pertinent information
                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent);
                    newCard.querySelector(".event_card_time").innerHTML = formatTime(dateEachComponent);
                    newCard.querySelector('img').src = image;
                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                    //Finally, attach this new card to the gallery
                    if (document.getElementById('likePosts')) {
                        document.getElementById('likePosts').appendChild(newCard);
                    }
                    
                })
            });
        })
}