function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            displayUserSchedule(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();


function displayUpcomingEventCards() {
    if (document.getElementById("event_card_template")) {
        var cardTemplate = document.getElementById("event_card_template");

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

                        document.getElementById("upcoming_browsing_list").appendChild(newCard);
                    }

                    if (document.getElementById("upcoming_browsing_list").innerHTML == "") {
                        document.getElementById("upcoming_browsing_list").innerHTML = `<p class="mx-auto my-20">No Events Found.</p>`
                    }
                })
            })
    }
}
displayUpcomingEventCards()

function displayUserSchedule(user) {
    var cardTemplate = document.getElementById("user_event_schedule_template");
    var eventIDs = []
    

    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {
            if (userDoc.data().eventAttend) {
                document.getElementById("user_event_schedule").innerHTML = ""
                eventIDs = userDoc.data().eventAttend
                console.log(eventIDs)

                db.collection("events")
                    .orderBy("dateTime")
                    .get()
                    .then(allEvents => {
                        allEvents.forEach(doc => {
                            if (eventIDs.includes(doc.id)) {
                                var dateTime = new Date(doc.data().dateTime);
                                var dateEachComponent = getDateList(dateTime)
                                var today = new Date();
                                var todayEachComponent = getDateList(today)

                                if (compareDates(todayEachComponent, dateEachComponent)) {
                                    var title = doc.data().title;
                                    var image = doc.data().image
                                    var docID = doc.id;
                                    let newCard = cardTemplate.content.cloneNode(true);

                                    newCard.querySelector(".schedule_card_title").innerHTML = title;
                                    newCard.querySelector(".schedule_card_date").innerHTML = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent);
                                    newCard.querySelector(".schedule_card_time").innerHTML = formatTime(dateEachComponent);
                                    newCard.querySelector('img').src = image;
                                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                                    document.getElementById("user_event_schedule").appendChild(newCard);
                                }
                            }
                        })
                    })
            } 
        })

}           
