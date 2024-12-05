var ImageFile;
var image;
var title;
var dateTime;

var check = document.getElementById("defaultImg");
check.addEventListener("click", savedefaultImg);

function savedefaultImg() {
  console.log("checked");
  if (document.getElementById("defaultImg").checked) {
    ImageFile = null;
    const chooseDefault = document.querySelector("input:checked").dataset.url;
    document.getElementById("user_pic").src = "";
    localStorage.setItem("defaultPic", chooseDefault);
  } else {
    document.getElementById("defaultImg").checked = false;
  }
}

function listenFileSelect() {
  //listen for file selection
  var fileInput = document.getElementById("image");
  const image = document.getElementById("user_pic");

  //when a change happens to the File Chooser Input
  fileInput.addEventListener("change", function (e) {
    document.getElementById("defaultImg").checked = false;
    ImageFile = e.target.files[0];
    var blob = URL.createObjectURL(ImageFile);
    image.src = blob; //Display this image
  });
}
listenFileSelect();

async function createEvent() {
  var eventInfo = db.collection("events");
  var category = document.getElementById("category");
  var typeEvent = document.getElementById("typeEvent");
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
            typeOfEvent: typeEvent.options[typeEvent.selectedIndex].value,
            activityLevel: parseInt(
              document.getElementById("activityLevel").value
            ),
            maximumParticipants: parseInt(
              document.getElementById("maximumParticipants").value
            ),
            streetNumber: document.getElementById("streetNumber").value,
            streetName: document.getElementById("streetName").value,
            city: document.getElementById("city").value,
            dateTime: dateTime,
            last_updated: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((doc) => {
            console.log("1. Post document added!");
            console.log(doc.id);
            if (ImageFile) uploadPic(doc.id);
            else savePostInfoforUser(doc.id);
            swal({
              title: "Event created!",
              text: "Your event was successfully created.",
              type: "success",
              confirmButtonColor: "#e1ae17",
              confirmButtonText: "Ok",
            });
          })
          .then(console.log("Uploaded"));
      } else {
        console.log("Error, no user signed in");
      }
    });
}

var create_event_btn = document.getElementById("create_event_btn");
create_event_btn.addEventListener("click", () => {
  //Check if the user fill in all required information
  var event_title = document.getElementById("title").value;
  var event_dateTime = document.getElementById("dateTime").value;
  var event_category = document.getElementById("category").value;
  var event_typeEvent = document.getElementById("typeEvent").value;
  var event_description = document.getElementById("description").value;
  var event_activityLevel = document.getElementById("activityLevel").value;
  var event_maximumParticipants = document.getElementById("maximumParticipants").value;
  var event_streetNumber = document.getElementById("streetNumber").value;
  var event_streetName = document.getElementById("streetName").value;
  var event_city = document.getElementById("city").value;

  if (
    !event_title ||
    !event_description ||
    !event_category ||
    !event_typeEvent ||
    !event_activityLevel ||
    !event_maximumParticipants ||
    !event_streetNumber ||
    !event_streetName ||
    !event_city ||
    !event_dateTime
  ) {
    swal({
      title: "Missing Information",
      text: "Please fill out all required fields before creating the event.",
      type: "error",
      confirmButtonColor: "#e3342f",
      confirmButtonText: "OK",
    });
    return;
  } else createEvent();
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
  if (!ImageFile) {
    var savedPicture = localStorage.getItem("defaultPic");
    db.collection("events").doc(postDocID).update({
      image: savedPicture,
    });
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

function editEvent(docID) {
  var eventInfo = db.collection("events");
  var category = document.getElementById("category");
  title = document.getElementById("title").value;
  (dateTime = document.getElementById("dateTime").value),
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        eventInfo
          .doc(docID)
          .update({
            title: title,
            description: document.getElementById("description").value,
            category: category.options[category.selectedIndex].value,
            typeOfEvent: typeEvent.options[typeEvent.selectedIndex].value,
            activtyLevel: parseInt(
              document.getElementById("activityLevel").value
            ),
            maximumParticipants: parseInt(
              document.getElementById("maximumParticipants").value
            ),
            streetNumber: document.getElementById("streetNumber").value,
            streetName: document.getElementById("streetName").value,
            city: document.getElementById("city").value,
            location: document.getElementById("streetNumber").value + " " + document.getElementById("streetName").value + " " + document.getElementById("city").value,
            dateTime: dateTime,
            last_updated: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((doc) => {
            console.log("1. Post document added!");
            if (ImageFile) uploadPic(docID);
            else savePostInfoforUser(docID);
          });
      } else {
        console.log("Error, no user signed in");
      }
    });
}