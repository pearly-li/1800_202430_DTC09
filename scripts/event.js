var ImageFile;
var date;
var title;
var time;
var image;
function listenFileSelect() {
    var fileInput = document.getElementById("image");
    const image = document.getElementById("user_pic");

    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0]; 
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob; 
    })
}
listenFileSelect();

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
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    month = monthNames[month]
    date = `${month} ${day}${ordinal}`;

    return date
}

function changeDateTime(){
    date = new Date(`${document.getElementById("date").value}, ${document.getElementById("time").value}`);
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
    time = `${event_hour}:${event_minute} ${timeSuffix}`

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
    createEvent()
}

function createEvent() {
    var eventInfo = db.collection("events");
    var cv = document.getElementById("category");
    title = document.getElementById("title").value;


    firebase.auth().onAuthStateChanged(function (user){
        if (user) {
            eventInfo.add({
                host: user.uid,
                title: title,
                description: document.getElementById("description").value,
                category: cv.options[cv.selectedIndex].value,
                scale: parseInt(document.getElementById("scale").value),
                location: document.getElementById("address").value,
                date: date,
                time: time,
                dateForUpcomingEvent: document.getElementById("date").value,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp()
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            console.log("Error, no user signed in");
        }
    });
}

event_info = document.getElementById("event_btn")
event_info.addEventListener("click", () => {
    changeDateTime()
})

function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)

        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                .then(function (url) {
                    console.log("3. Got the download URL.");
                    image = url;
                    db.collection("events").doc(postDocID).update({
                        "image": url
                    })
                    .then(function () {
                        console.log('4. Added pic URL to Firestore.');
                        savePostIDforUser(postDocID);
                    })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
        console.log("user id is: " + user.uid);
        console.log("postdoc id is: " + postDocID);
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        })
        db.collection("events").doc(postDocID).update({
            participants: firebase.firestore.FieldValue.arrayUnion(user.uid)
        })
        var eventList = db.collection("users").doc(user.uid).collection("event");
        eventList.add({
            postID: postDocID,
            title: title,
            time: time,
            date: date,
            image: image
        })
            .then(() => {
                console.log("5. Saved to user's document!");
                window.location.href = "event_detail.html?docID=" + postDocID
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    })
}