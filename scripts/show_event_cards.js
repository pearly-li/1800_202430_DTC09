function displayEventCards() {
    let cardTemplate = document.getElementById("event_card_template");

    db.collection("events").get()
        .then(allEvents => {
            
            allEvents.forEach(doc => {
                var title = doc.data().title;
                var date = new Date(`${doc.data().dateForUpcomingEvent}`);
                var time = doc.data().time;
                var image = doc.data().image
                var docID = doc.id;
                let newCard = cardTemplate.content.cloneNode(true);

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
                    date = doc.data().date;
                }


                newCard.querySelector(".event_card_title").innerHTML = title;
                newCard.querySelector(".event_card_date").innerHTML = date;
                newCard.querySelector(".event_card_time").innerHTML = time;
                newCard.querySelector('img').src = image;
                newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                document.getElementById("browsing_list").appendChild(newCard);
            })
        })
}

displayEventCards()

function displayUpcomingEventCards() {
    let cardTemplate = document.getElementById("event_card_template");

    db.collection("events").get()
        .then(allEvents => {
            
            allEvents.forEach(doc => {
                var title = doc.data().title;
                var date = new Date(`${doc.data().dateForUpcomingEvent}`);
                var image = doc.data().image;
                var time = doc.data().time;
                var docID = doc.id;
                var withinThreeDays = false;
                let newCard = cardTemplate.content.cloneNode(true);

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

                var afterTomorrowDay = currentDay + 2;
                var afterTomorrowMonth = currentMonth;
                var afterTomorrowYear = currentYear;
                if (tomorrowDay == maxDays + 1) {
                    tomorrowDay = 1;
                    tomorrowMonth += 1;
                } else if (tomorrowDay == maxDays + 2) {
                    tomorrowDay = 2;
                    tomorrowMonth += 1;
                }

                if (tomorrowMonth > 11) {
                    tomorrowMonth = 0;
                    tomorrowYear += 1;
                }


                if (currentYear === year && currentMonth === month && currentDay === day) {
                    date = "Today";
                    withinThreeDays = true;
                } else if (tomorrowYear === year && tomorrowMonth === month && tomorrowDay === day) {
                    date = "Tomorrow";
                    withinThreeDays = true;
                } else if (afterTomorrowYear === year && afterTomorrowMonth === month && afterTomorrowDay === day) {
                    date = doc.data().date;
                    withinThreeDays = true;
                } else {
                    date = doc.data().date;
                }


                if (withinThreeDays == true) {
                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = date;
                    newCard.querySelector(".event_card_time").innerHTML = time;
                    newCard.querySelector('img').src = image;
                    newCard.querySelector('a').href = "event_detail.html?docID=" + docID;
    
                    document.getElementById("upcoming_browsing_list").appendChild(newCard);
                }
            })
        })
}

displayUpcomingEventCards()

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            ShowLikePosts(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

function ShowLikePosts(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Get the Array of likePosts
            var likes = userDoc.data().likePosts;
            console.log(likes);

            // Get pointer the new card template
            let newcardTemplate = document.getElementById("event_card_template");

            // Iterate through the ARRAY of liked events (document ID's)
            likes.forEach(thisEventID => {
                console.log(thisEventID);
                db.collection("events").doc(thisEventID).get().then(doc => {
                    var title = doc.data().title; // get value of the "name" key
                    var image = doc.data().image; //get unique ID to each hike to be used for fetching right image
                    var time = doc.data().time; //gets the length field
                    var date = doc.data().date;  //this is the autogenerated ID of the document
                    var docID = doc.id;

                    //clone the new card
                    let newcard = newcardTemplate.content.cloneNode(true);

                    //update title and some pertinant information
                    newcard.querySelector(".event_card_title").innerHTML = title;
                    newcard.querySelector(".event_card_date").innerHTML = date;
                    newcard.querySelector(".event_card_time").innerHTML = time;
                    newcard.querySelector('img').src = image;
                    newcard.querySelector('a').href = "event_detail.html?docID=" + docID;

                    //Finally, attach this new card to the gallery
                    document.getElementById('likePosts').appendChild(newcard);
                })
            });
        })
}