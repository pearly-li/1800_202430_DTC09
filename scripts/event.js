var ImageFile;
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

function createEvent() {
    alert("SAVE POST is triggered");
    var eventInfo = db.collection("events");
    var cv = document.getElementById("category");

    firebase.auth().onAuthStateChanged(function (user){
        if (user) {
            eventInfo.add({
                host: user.uid,
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                category: cv.options[cv.selectedIndex].value,
                scale: parseInt(document.getElementById("scale").value),
                location: document.getElementById("address").value,
                date: document.getElementById("date").value,
                time: document.getElementById("time").value,
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
    listenFileSelect();
    createEvent()
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
            .then(() => {
                console.log("5. Saved to user's document!");
                alert("Post is complete!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    })
}