var currentUser; //points to the document of the user who is logged in
var newSavedPicture = db.collection("users").doc("profilePicture");
// Problem is that we're loading the profile picture from local storage and NOT the user's saved image from firebase. I need to change that section in populateUserInfo(). Then it'll show up properly. Also, need to change the         if (savedPicture) {
//   document.querySelector(
//     "#pictureGoesHere"
//   ).src = `images/${savedPicture}`;
// }
// to reflect the savedimage in firebase
function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        let userName = userDoc.data().name;
        // let userProfilePicture = userDoc.data().profilePicture;
        let userCity = userDoc.data().city;
        if (userName) {
          document.getElementById("nameInput").value = userName;
        }
        if (userCity) {
          document.getElementById("cityInput").value = userCity;
        }
        // Find saved image in firebase if it exists, and then have it as the selected image to be auto populated on page load
        if (newSavedPicture) {
          document.getElementById(
            "selectedPicture"
          ).src = `images/${newSavedPicture}`;
        } else {
          console.log("No saved photo yet.");
        }
        // Put the profile picture in the header
        if (newSavedPicture) {
          document.querySelector(
            "#pictureGoesHere"
          ).src = `images/${newSavedPicture}`;
        }
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}
//call the function to run it
window.onload = populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}
//

// function selectProfilePicture() {}
// selectedAvatar is the variable for what's checked
// selectedPicture is the ID of the image in HTML
// profilePicture is name of radio buttons to check if it's checked

// Needed to find radio buttons, within the form, and then add event listeners. We went with addEventListener over buttononlick since that seems like the plan we're used to.

var radios = document.querySelectorAll(".avatarContainer");
for (const radio of radios) {
  radio.addEventListener("click", saveProfilePicture);
}

function saveProfilePicture() {
  // Get the selected avatar
  const selectedAvatar = document.querySelector("input:checked").dataset.url;

  // Display the selected image immediately
  document.getElementById("selectedPicture").src = `images/${selectedAvatar}`;

  // Save the avatar choice in localStorage
  localStorage.setItem("profilePicture", selectedAvatar);
}

function loadProfilePicture() {
  // Load the saved profile picture from Firebase, if available
  if (newSavedPicture) {
    document.getElementById(
      "selectedPicture"
    ).src = `images/${newSavedPicture}`;
  } else {
    console.log("No saved photo yet.");
  }
}

// function getSelectedPicture() {
//   // Get the selected picture as the user selects different options in their profile page.
//   if (savedPicture) {
//     document.getElementById("selectedPicture").src = `images/${savedPicture}`;
//   } else {
//     console.log("No saved photo yet.");
//   }
// }
// ---------------------------------------------------
function saveUserInfo() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      saveProfilePicture();
      // (a) get user values
      let userName = document.getElementById("nameInput").value;
      //get the value of the field with id="nameInput"
      let userCity = document.getElementById("cityInput").value;
      //get the value of the field with id="cityInput"
      var savedPicture = localStorage.getItem("profilePicture");
      //b) update user's document in Firestore
      currentUser
        .update({
          name: userName,
          // profilePicture: "localstorage", // Save the URL into users collection
          city: userCity,
          profile_picture: savedPicture,
        })
        .then(() => {
          console.log("Document successfully updated!");
          document.getElementById("personalInfoFields").disabled = true;
          window.location.href = "user_profile.html";
        });
    } else {
      console.log("No user logged in.");
    }
  });
}

document.getElementById("likedEvents").addEventListener("click", () => {
  window.location.href = "liked_events.html";
});
document.getElementById("logOut").addEventListener("click", () => {
  window.location.href = "index.html";
});
