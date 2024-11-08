// var currentUser; //points to the document of the user who is logged in

// Technically the below code is more proper but what I already have is working
// var eventDocID = localStorage.getItem("eventDocID"); //visible to all functions on this page
// function getEventName(id) {
//   db.collection("events")
//     .doc(id)
//     .get()
//     .then((thisEvent) => {
//       var eventName = thisEvent.data().name;
//       document.getElementById("eventName").innerHTML = eventName;
//     });
// }
// getEventName(eventDocID);

function writeMessage() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        let userName = userDoc.data().name;
        var messageRef = db.collection("messages");

        messageRef
          .add({
            reviewer_name: userName,
            message_description:
              document.getElementById("messageDescription").value,
            message_created_at: firebase.firestore.FieldValue.serverTimestamp(),
            last_updated: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            // Show alert when message is posted successfully
            alert("Message posted");
          })
          .catch((error) => {
            console.error("Error adding message: ", error);
          });
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}
writeMessage();
// Note to self: Will add a separate function to edit messages later, which will update the last_updated field but NOT the message_created_at
// Also need to make a popup to signal a message has been successfully entered!
