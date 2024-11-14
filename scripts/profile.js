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
        let userProfilePicture = userDoc.data().profilePicture;
        let userCity = userDoc.data().city;

        //if the data fields are not empty, then write them in to the form.
        if (userName != null) {
          document.getElementById("nameInput").value = userName;
        }
        // if (userPicture != null) {
        //   document.getElementById("profilePictureInput").value = profilePicture;
        // }
        // Removed this because of Firebase storage limitations. Implementing a choice of avatar from a select pool of options.
        if (userCity != null) {
          document.getElementById("cityInput").value = userCity;
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

function saveUserInfo() {
  firebase.auth().onAuthStateChanged(function (user) {
    saveProfilePicture();
    // (a) get user values
    let userName = document.getElementById("nameInput").value;
    //get the value of the field with id="nameInput"

    // Removed the following because of Firebase storage limitations.
    // let userProfilePicture = document.getElementById(
    //   "profilePictureInput"
    // ).value;
    let userCity = document.getElementById("cityInput").value;
    //get the value of the field with id="cityInput"

    //b) update user's document in Firestore
    currentUser
      .update({
        name: userName,
        profilePicture: "localstorage", // Save the URL into users collection
        city: userCity,
      })
      .then(() => {
        console.log("Document successfully updated!");
        document.getElementById("personalInfoFields").disabled = true;
      });
  });
}

function saveProfilePicture() {
  // Get the selected avatar
  const selectedAvatar = document.querySelector(
    'input[name="profilePicture"]:checked'
  ).value;

  // Display the selected image immediately
  document.getElementById("selectedPicture").src = `images/${selectedAvatar}`;

  // Save the avatar choice in localStorage
  localStorage.setItem("profilePicture", selectedAvatar);
}

function loadProfilePicture() {
  // Load the saved profile picture from localStorage, if available
  const savedPicture = localStorage.getItem("profilePicture");
  if (savedPicture) {
    document.getElementById("selectedPicture").src = `images/${savedPicture}`;
  }
}
// Call loadProfilePicture() when the page loads
window.onload = loadProfilePicture;
