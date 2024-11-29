var currentUser; //points to the document of the user who is logged in
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
        let userCity = userDoc.data().city;
        if (userName) {
          document.getElementById("nameInput").value = userName;
        }
        if (userCity) {
          document.getElementById("cityInput").value = userCity;
        }
        // Find saved image in firebase if it exists, and then have it as the selected image to be auto populated on page load
        var savedFirebasePicture = userDoc.data().profile_picture;
        if (savedFirebasePicture) {
          document.getElementById(
            "selectedPicture"
          ).src = `images/${savedFirebasePicture}`;
          console.log(savedFirebasePicture);
        } else {
          console.log("No saved photo yet.");
        }
        // Put the profile picture in the header
        if (savedFirebasePicture) {
          document.querySelector(
            "#pictureGoesHere"
          ).src = `images/${savedFirebasePicture}`;
          console.log("Do I need this?");
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
  if (savedFirebasePicture) {
    document.getElementById(
      "selectedPicture"
    ).src = `images/${savedFirebasePicture}`;
  } else {
    console.log("No saved photo yet.");
  }
}

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
