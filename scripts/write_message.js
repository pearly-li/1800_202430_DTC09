//go to the correct user document by referencing to the user uid
var currentUser = db.collection("users").doc(user.uid);
var userID = user.uid;
function getEventID() {
  eventID = db.collection("events").doc();
}

// function saveEventDocumentIDAndRedirect() {
//   let params = new URL(window.location.href); //get the url from the search bar
//   let ID = params.searchParams.get("docID");
//   localStorage.setItem("eventDocID", ID);
//   window.location.href = "message_list.html";
// }
// Go through all the messages, then do a loop looking for the reference to that event ID

function writeMessage() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        let userName = userDoc.data().name;
        var messageRef = db.collection("messages");
        let reviewerName = userName;
        let eventDocID = db.collection("events").doc.id;
        console.log(eventDocID);
        // var eventID = eventInfo.data().eventID;
        messageRef
          .add({
            userID: userID,
            eventDocID: eventDocID,
            reviewer_name: reviewerName,
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
      alert("You must be signed in to post a message.");
    }
  });
}
// Note to self: Will add a separate function to edit messages later, which will update the last_updated field but NOT the message_created_at
