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
        if (userSchool != null) {
          document.getElementById("profilePictureInput").value = profilePicture;
        }
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
  // (a) get user values
  let userName = document.getElementById("nameInput").value;
  //get the value of the field with id="nameInput"
  let userProfilePicture = document.getElementById("profilePictureInput").value;
  //get the value of the field with id="schoolInput"
  let userCity = document.getElementById("cityInput").value;
  //get the value of the field with id="cityInput"

  //b) update user's document in Firestore
  currentUser
    .update({
      name: userName,
      profile_picture: profilePicture,
      city: userCity,
    })
    .then(() => {
      console.log("Document successfully updated!");
    });
  //c) disable edit
  document.getElementById("personalInfoFields").disabled = true;
}
