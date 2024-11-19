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
    db.collection("users").doc(user.uid)
        .get()
        .then(userDoc => {
            // Get pointer the new card template
            if (document.getElementById("event_card_template"))
                var cardTemplate = document.getElementById("event_card_template");

            if (userDoc.data().likePosts) {
                // Get the Array of likePosts
                var likes = userDoc.data().likePosts
                console.log(likes)
                
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
            }
        })
}