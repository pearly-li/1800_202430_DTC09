var ImageFile;
// var eventImage;
var title;
var dateTime;
// const eventImage = document.getElementById("eventImage");
// function listenFileSelect() {
//   //listen for file selection
//   var fileInput = document.getElementById("image");
//   const eventImage = document.getElementById("eventImage");

//   //when a change happens to the File Chooser Input
//   fileInput.addEventListener("change", function (e) {
//     ImageFile = e.target.files[0];
//     var blob = URL.createObjectURL(ImageFile);
//     image.src = blob; //Display this image
//   });
// }
// listenFileSelect();

function saveEventPicture() {
  // Get the selected avatar
  const selectedEventPicture =
    document.querySelector("input:checked").dataset.url;

  // Display the selected image immediately
  document.getElementById(
    "selectedPicture"
  ).src = `images/${selectedEventPicture}`;

  // Save the event image choice in localStorage
  localStorage.setItem("eventPicture", selectedEventPicture);
}
var savedEventPicture = localStorage.getItem("eventPicture");

function loadEventPicture() {
  if (savedEventPicture) {
    document.getElementById(
      "selectedPicture"
    ).src = `images/${savedEventPicture}`;
  }
  var radios = document.querySelectorAll(".eventPictureContainer");
  for (const radio of radios) {
    radio.addEventListener("click", saveEventPicture);
  }
}
function populateSelectedEventPicture() {
  loadEventPicture();
}
populateSelectedEventPicture();

function createEvent() {
  var eventInfo = db.collection("events");
  var category = document.getElementById("category");
  title = document.getElementById("title").value;
  (dateTime = document.getElementById("dateTime").value),
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        eventInfo
          .add({
            host: user.uid,
            eventPicture: selectedEventPicture,
            title: title,
            description: document.getElementById("description").value,
            category: category.options[category.selectedIndex].value,
            activtyLevel: parseInt(
              document.getElementById("activityLevel").value
            ),
            location: document.getElementById("location").value,
            dateTime: dateTime,
            last_updated: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((doc) => {
            console.log("1. Post document added!");
            console.log(doc.id);
            uploadPic(doc.id);
          });
      } else {
        console.log("Error, no user signed in");
      }
    });
}

// Disabled the following due to Firebase's storage limitations. Offer options of images instead as a work around as per Carly's suggestions in Tech Tips in Slack. - Pearly
// function uploadPic(postDocID) {
//   console.log("inside uploadPic " + postDocID);
//   var storageRef = storage.ref("images/" + postDocID + ".jpg");

//   storageRef
//     .put(ImageFile)

//     .then(function () {
//       console.log("2. Uploaded to Cloud Storage.");
//       storageRef
//         .getDownloadURL()

//         .then(function (url) {
//           console.log("3. Got the download URL.");
//           image = url;
//           db.collection("events")
//             .doc(postDocID)
//             .update({
//               image: url,
//             })
//             .then(function () {
//               console.log("4. Added pic URL to Firestore.");
//               savePostInfoforUser(postDocID);
//             });
//         });
//     })
//     .catch((error) => {
//       console.log("error uploading to cloud storage");
//     });
// }

//saves the post information for the user, in an array
function savePostInfoforUser(postDocID) {
  firebase.auth().onAuthStateChanged((user) => {
    console.log("user id is: " + user.uid);
    console.log("postdoc id is: " + postDocID);
    db.collection("users")
      .doc(user.uid)
      .update({
        myposts: firebase.firestore.FieldValue.arrayUnion(postDocID),
      });
    db.collection("events")
      .doc(postDocID)
      .update({
        participants: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
    db.collection("users")
      .doc(user.uid)
      .update({
        eventAttend: firebase.firestore.FieldValue.arrayUnion(postDocID),
      })
      .then(() => {
        console.log("5. Saved to user's document!");
        window.location.href = "event_detail.html?docID=" + postDocID;
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  });
}
