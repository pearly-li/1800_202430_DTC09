var today = new Date();
var yesterday = new Date()
var tomorrow = new Date()
yesterday.setDate(yesterday.getDate() - 1)
tomorrow.setDate(yesterday.getDate() + 1)

var todayEachComponent = getDateList(today)
var tomorrowEachComponent = getDateList(tomorrow)
var yesterdayEachComponent = getDateList(yesterday)

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


function showLikedPosts(user) {
    console.log("Liked")
    var cardTemplate = document.getElementById("event_card_template");
    var eventIDs = []
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {
            if (userDoc.data().likePosts) {
                if (userDoc.data().likePosts.length > 0) {
                    document.getElementById("likePosts").innerHTML = ""

                    eventIDs = userDoc.data().likePosts
                    console.log(eventIDs)

                    eventIDs.forEach(docID => {
                        db.collection("events").doc(docID)
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

                                document.getElementById("likePosts").appendChild(newCard);
                        })
                    })
                } else {
                    document.getElementById("likePosts").innerHTML = `
                        <p class="m-auto text-center my-20">
                        Not attending any events.
                        <br>
                        <a href="browse.html" class="text-blue-800 underline">Browse for events</a>
                        </p>`
                }
            } else {
                document.getElementById("likePosts").innerHTML = `
                    <p class="m-auto text-center my-20">
                    Not attending any events.
                    <br>
                    <a href="browse.html" class="text-blue-800 underline">Browse for events</a>
                    </p>`
            }
        })

}


// function showLikedPosts(user) {
//     db.collection("users").doc(user.uid)
//         .get()
//         .then(userDoc => {
//             // Get pointer the new card template
//             if (document.getElementById("event_card_template"))
//                 var cardTemplate = document.getElementById("event_card_template");

//             if (userDoc.data().likePosts) {
//                 // Get the Array of likePosts
//                 var likes = userDoc.data().likePosts
//                 console.log(likes)
                
//                 // Iterate through the ARRAY of liked events (document ID's)
//                 likes.forEach(thisEventID => {
//                     console.log(thisEventID);
//                     db.collection("events").doc(thisEventID).get().then(doc => {
//                         var dateTime = new Date(doc.data().dateTime); 
//                         var dateEachComponent = getDateList(dateTime)
//                         var today = new Date();
//                         var todayEachComponent = getDateList(today)

//                         var title = doc.data().title; 
//                         var image = doc.data().image; 
//                         var docID = doc.id;
//                         let newCard = cardTemplate.content.cloneNode(true);

//                         //update title and some pertinent information
//                         newCard.querySelector(".event_card_title").innerHTML = title;
//                         newCard.querySelector(".event_card_date").innerHTML = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent);
//                         newCard.querySelector(".event_card_time").innerHTML = formatTime(dateEachComponent);
//                         newCard.querySelector('img').src = image;
//                         newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

//                         //Finally, attach this new card to the gallery
//                         if (document.getElementById('likePosts')) {
//                             document.getElementById('likePosts').appendChild(newCard);
//                         }
                        
//                     })
//                 });
//             }
//         })
// }