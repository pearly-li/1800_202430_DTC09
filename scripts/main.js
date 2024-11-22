var todayEachComponent = getDateList(new Date())
var upcomingEvents = []



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


async function loadAllEvents() {
    return db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                let dateEachComponent = getDateList(new Date(doc.data().dateTime))
                let dateTime = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent)

                if (compareDates(todayEachComponent, dateEachComponent) && (dateTime == "Today" || dateTime == "Tomorrow")) {
                    upcomingEvents.push(doc.id)
                }
                
            }
            ));
}

function displayResults() {
    if (upcomingEvents.length != 0) {
        var cardTemplate = document.getElementById("event_card_template");
        
        document.getElementById("upcoming_browsing_list").innerHTML = "";
        upcomingEvents.forEach(eventDocID => {
            db.collection("events").doc(eventDocID)
                .get()
                .then(doc => {
                    dateTime = new Date(doc.data().dateTime);
                    dateEachComponent = getDateList(dateTime)

                    title = doc.data().title;
                    image = doc.data().image
                    docID = doc.id;
                    newCard = cardTemplate.content.cloneNode(true);

                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent);
                    newCard.querySelector(".event_card_time").innerHTML = formatTime(dateEachComponent);
                    newCard.querySelector('img').src = image;
                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                    document.getElementById("upcoming_browsing_list").appendChild(newCard);
                })
        })
    }
}

function displayUserSchedule(user) {
    var cardTemplate = document.getElementById("user_event_schedule_template");
    var eventIDs = []


    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {
            if (userDoc.data().eventAttend) {
                if (userDoc.data().eventAttend.length > 0) {
                    document.getElementById("user_event_schedule").innerHTML = ""
                }
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


async function setup() {
    await loadAllEvents()
    displayResults()
}
setup()
