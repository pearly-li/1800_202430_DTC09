var currentUser; //points to the document of the user who is logged in
var savedPicture = localStorage.getItem("profilePicture");

function loadProfilePicture() {
  // Load the saved profile picture from localStorage, if available
  if (savedPicture) {
    document.getElementById("selectedPicture").src = `images/${savedPicture}`;
  }
}

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
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
