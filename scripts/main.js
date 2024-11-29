var today = new Date();
var yesterday = today
var tomorrow = today
yesterday.setDate(yesterday.getDate() - 1)
tomorrow.setDate(yesterday.getDate() + 1)

var todayEachComponent = getDateList(today)
var tomorrowEachComponent = getDateList(tomorrow)
var yesterdayEachComponent = getDateList(yesterday)
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


async function loadAllUpcomingEvents() {
    return db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                let dateEachComponent = getDateList(new Date(doc.data().dateTime))
                let dateTime = checkIfTodayOrTomorrowOrYesterday(todayEachComponent, todayEachComponent, yesterdayEachComponent, dateEachComponent)

                if (dateTime == "Today" || dateTime == "Tomorrow") {
                    upcomingEvents.push(doc.id)
                }

            }
            ));
}

function displayResults() {
    if (upcomingEvents.length > 0) {
        var cardTemplate = document.getElementById("event_card_template");

        document.getElementById("upcoming_browsing_list").innerHTML = "";
        upcomingEvents.forEach(eventDocID => {
            db.collection("events").doc(eventDocID)
                .get()
                .then(doc => {
                    var dateEachComponent = getDateList(new Date(doc.data().dateTime))

                    var dateDisplay = checkIfTodayOrTomorrowOrYesterday(todayEachComponent, tomorrowEachComponent, yesterdayEachComponent, dateEachComponent);
                    var title = doc.data().title;
                    var image = doc.data().image
                    var docID = doc.id;
                    let newCard = cardTemplate.content.cloneNode(true);

                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = dateDisplay;
                    newCard.querySelector(".event_card_time").innerHTML = formatTimeAgo(dateDisplay, todayEachComponent, dateEachComponent);
                    newCard.querySelector('img').src = image;
                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                    document.getElementById("upcoming_browsing_list").appendChild(newCard);
                })
        })
    } else {
        document.getElementById("upcoming_browsing_list").innerHTML = `
        <p class="m-auto text-center my-20">
        No Upcoming Events Found.
        <br>
        <a href="browse.html" class="text-blue-800 underline">Browse for events</a>
        </p>`
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

                    eventIDs = userDoc.data().eventAttend
                    console.log("OAISDOJA")
                    console.log(eventIDs)

                    db.collection("events")
                        .orderBy("dateTime")
                        .get()
                        .then(allEvents => {
                            allEvents.forEach(doc => {
                                if (eventIDs.includes(doc.id)) {
                                    var dateEachComponent = getDateList(new Date(doc.data().dateTime))

                                    var dateDisplay = checkIfTodayOrTomorrowOrYesterday(todayEachComponent, tomorrowEachComponent, yesterdayEachComponent, dateEachComponent);
                                    var title = doc.data().title;
                                    var image = doc.data().image
                                    var docID = doc.id;
                                    let newCard = cardTemplate.content.cloneNode(true);

                                    newCard.querySelector(".schedule_card_title").innerHTML = title;
                                    newCard.querySelector(".schedule_card_date").innerHTML = dateDisplay;
                                    newCard.querySelector(".schedule_card_time").innerHTML = formatTimeAgo(dateDisplay, todayEachComponent, dateEachComponent);
                                    newCard.querySelector('img').src = image;
                                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                                    document.getElementById("user_event_schedule").appendChild(newCard);

                                }
                            })
                        })
                } else {
                    document.getElementById("user_event_schedule").innerHTML = `
                        <p class="m-auto text-center">
                        Not attending any events.
                        <br>
                        <a href="browse.html" class="text-blue-800 underline">Browse for events</a>
                        </p>`
                }
            } else {
                document.getElementById("user_event_schedule").innerHTML = `
                    <p class="m-auto text-center">
                    Not attending any events.
                    <br>
                    <a href="browse.html" class="text-blue-800 underline">Browse for events</a>
                    </p>`
            }
        })

}


async function setup() {
    await loadAllUpcomingEvents()
    displayResults()
}
setup()
