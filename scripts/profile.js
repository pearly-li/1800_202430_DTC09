var currentUser; //points to the document of the user who is logged in
var savedPicture = localStorage.getItem("profilePicture");

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

        if (userCity) {
          document.getElementById("cityInput").value = userCity;
        }
        loadProfilePicture();
        // Put the profile picture in the header
        if (savedPicture) {
          document.querySelector(
            "#pictureGoesHere"
          ).src = `images/${savedPicture}`;
        }
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}
//call the function to run it
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}
//
function saveUserInfo() {
  firebase.auth().onAuthStateChanged(function (user) {
    saveProfilePicture();
    // (a) get user values
    let userName = document.getElementById("nameInput").value;
    //get the value of the field with id="nameInput"

    let userCity = document.getElementById("cityInput").value;
    //get the value of the field with id="cityInput"
    loadProfilePicture();
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
      });
  });
}

// function selectProfilePicture() {}
// selectedAvatar is the variable for what's checked
// selectedPicture is the ID of the image in HTML
// profilePicture is name of radio buttons to check if it's checked
function saveProfilePicture() {
  // Get the selected avatar
  const selectedAvatar = document.querySelector("input:checked").dataset.url;

  // Display the selected image immediately
  document.getElementById("selectedPicture").src = `images/${selectedAvatar}`;

  // Save the avatar choice in localStorage
  localStorage.setItem("profilePicture", selectedAvatar);
}

function loadProfilePicture() {
  // Load the saved profile picture from localStorage, if available
  if (savedPicture) {
    document.getElementById("selectedPicture").src = `images/${savedPicture}`;
  }

  // Needed to find radio buttons, within the form, and then add event listeners. We went with addEventListener over buttononlick since that seems like the plan we're used to.

  var radios = document.querySelectorAll(".avatarContainer");
  for (const radio of radios) {
    radio.addEventListener("click", saveProfilePicture);
  }
}

document.getElementById("likedEvents").addEventListener("click", () => {
  window.location.href = "likedEvents.html";
});
document.getElementById("logOut").addEventListener("click", () => {
  window.location.href = "index.html";
});
