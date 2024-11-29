// Disabled the following since they're not being used. -Pearly
// function getNameFromAuth() {
//   firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       // console.log(user.uid);
//       // console.log(user.displayName);
//       userName = user.displayName;

//       document.getElementById("name_goes_here").innerText = userName;
//     } else {
//       console.log("No user is logged in");
//     }
//   });
// }
// getNameFromAuth();

function getPageName() {
  document.getElementById("page_label_goes_here").innerHTML =
    document.getElementById("page_label").innerHTML;
}
getPageName();

// This is the function that generates profile_picture in the top nav
var currentUser; //points to the document of the user who is logged in

function populateUserInfo() {
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
