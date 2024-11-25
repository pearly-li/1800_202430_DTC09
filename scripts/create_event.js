var ImageFile = null;
var image;
var title;
var dateTime;

var check = document.getElementById("defaultImg");
check.addEventListener("click", savedefaultImg);

function savedefaultImg() {
  // Get the selected avatar
  const chooseDefault = document.querySelector("input:checked").dataset.url;

  // Save the avatar choice in localStorage
  localStorage.setItem("defaultPic", chooseDefault);
}

function listenFileSelect() {
  //listen for file selection
  var fileInput = document.getElementById("image");
  const image = document.getElementById("user_pic");

  //when a change happens to the File Chooser Input
  fileInput.addEventListener("change", function (e) {
    ImageFile = e.target.files[0];
    var blob = URL.createObjectURL(ImageFile);
    image.src = blob; //Display this image
  });
}
listenFileSelect();

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
            title: title,
            description: document.getElementById("description").value,
            category: category.options[category.selectedIndex].value,
            activtyLevel: parseInt(
              document.getElementById("activityLevel").value
            ),
            maximumParticipants: parseInt(
              document.getElementById("capacity").value
            ),
            location: document.getElementById("address").value,
            dateTime: dateTime,
            last_updated: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((doc) => {
            console.log("1. Post document added!");
            console.log(doc.id);
            if (ImageFile)
              uploadPic(doc.id);
            else
              savePostInfoforUser(doc.id)
          });
      } else {
        console.log("Error, no user signed in");
      }
    });
}

var create_event_btn = document.getElementById("create_event_btn");
create_event_btn.addEventListener("click", () => {
  createEvent();
});

function uploadPic(postDocID) {
  console.log("inside uploadPic " + postDocID);
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(ImageFile)

    .then(function () {
      console.log("2. Uploaded to Cloud Storage.");
      storageRef
        .getDownloadURL()

        .then(function (url) {
          console.log("3. Got the download URL.");
          image = url;
          db.collection("events")
            .doc(postDocID)
            .update({
              image: url,
            })
            .then(function () {
              console.log("4. Added pic URL to Firestore.");
              savePostInfoforUser(postDocID);
            });
        });
    })
    .catch((error) => {
      console.log("error uploading to cloud storage");
    });
}

//saves the post information for the user, in an array
function savePostInfoforUser(postDocID) {
  if (!ImageFile){
    var savedPicture = localStorage.getItem("defaultPic");
    db.collection("events")
    .doc(postDocID)
    .update({
      image: savedPicture,
    })
  }
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
