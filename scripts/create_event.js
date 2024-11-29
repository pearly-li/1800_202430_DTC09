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

function createEvent() {
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

function getLocation() {
  map;
  originPlaceId;
  destinationPlaceId;
  travelMode;
  directionsService;
  directionsRenderer;
  this.originPlaceId = "";
  this.destinationPlaceId = "";
  this.travelMode = google.maps.TravelMode.WALKING;
  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer();
  this.directionsRenderer.setMap(map);

  const originInput = document.getElementById("origin-input");
  const destinationInput = document.getElementById("destination-input");
  const modeSelector = document.getElementById("mode-selector");
  // Specify just the place data fields that you need.
  const originAutocomplete = new google.maps.places.Autocomplete(originInput, {
    fields: ["place_id"],
  });
  // Specify just the place data fields that you need.
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput,
    { fields: ["place_id"] }
  );

  this.setupClickListener("changemode-walking", google.maps.TravelMode.WALKING);
  this.setupClickListener("changemode-transit", google.maps.TravelMode.TRANSIT);
  this.setupClickListener("changemode-driving", google.maps.TravelMode.DRIVING);
  this.setupPlaceChangedListener(originAutocomplete, "ORIG");
  this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
    destinationInput
  );
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
  setupPlaceChangedListener(autocomplete, mode);
  autocomplete.bindTo("bounds", this.map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }

    if (mode === "ORIG") {
      this.originPlaceId = place.place_id;
    } else {
      this.destinationPlaceId = place.place_id;
    }

    this.route();
  });
}
