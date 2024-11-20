function populateReviewerPicture() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        let userProfilePicture = userDoc.data().profile_picture;
        // Put the profile picture in the header
        if (userProfilePicture) {
          document.querySelector(
            "#pictureGoesHere"
          ).src = `images/${userProfilePicture}`;
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
