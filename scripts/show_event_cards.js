function displayEventCards() {
    let cardTemplate = document.getElementById("event_card_template");

    db.collection("events").get()
        .then(allEvents => {
            allEvents.forEach(doc => {
                var title = doc.data().title;
                var date = new Date(`${doc.data().date}, ${doc.data().time}`);
                var docID = doc.id;
                let newCard = cardTemplate.content.cloneNode(true);


                // Code to display time
                var event_hour = date.getHours()
                var event_minute = date.getMinutes()
                var timeSuffix = "AM"
                if (event_hour > 12) {
                    event_hour -= 12
                    timeSuffix = "PM"
                }
                var time = `${event_hour}:${event_minute} ${timeSuffix}`


                // Code to display date
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();

                var today = new Date();
                var currentYear = today.getFullYear();
                var currentMonth = today.getMonth();
                var currentDay = today.getDate();

                maxDays = 31
                if (currentMonth in [4, 6, 9, 11]) {
                    maxDays = 30;
                } else if (currentYear % 4 == 0) {
                    maxDays = 29
                } else if (currentMonth == 2) {
                    maxDays = 28
                }

                var tomorrowDay = currentDay + 1;
                var tomorrowMonth = currentMonth;
                var tomorrowYear = currentYear;
                if (tomorrowDay > maxDays) {
                    tomorrowDay = 1;
                    tomorrowMonth += 1;
                }
                if (tomorrowMonth > 11) {
                    tomorrowMonth = 0;
                    tomorrowYear += 1;
                }

                if (currentYear === year && currentMonth === month && currentDay === day) {
                    date = "Today";
                } else if (tomorrowYear === year && tomorrowMonth === month && tomorrowDay === day) {
                    date = "Tomorrow";
                } else {
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
                }


                newCard.querySelector(".event_card_title").innerHTML = title;
                newCard.querySelector(".event_card_date").innerHTML = date;
                newCard.querySelector(".event_card_time").innerHTML = time;
                newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                document.getElementById("browsing_list").appendChild(newCard);
            })
        })
}

displayEventCards()