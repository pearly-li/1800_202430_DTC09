//go to the correct user document by referencing to the user uid
var params = new URL(window.location.href);
var eventID = params.searchParams.get("docID");

// When you run into a problem, use the debugging and set a breakpoint right after the thing I need to test. We tested the doc and we could fetch data.
// After we set breakpoint at
// function saveEventDocumentIDAndRedirect() {
//   let params = new URL(window.location.href); //get the url from the search bar
//   let ID = params.searchParams.get("docID");
//   localStorage.setItem("eventDocID", ID);
//   window.location.href = "message_list.html";
// }
// Go through all the messages, then do a loop looking for the reference to that event ID
function editMessage() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      //get the document for current user.
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        // var lengthOfMessageList = messageRef;
        var messageRef = db.collection("messages");
        console.log(eventID);
        // let eventDocID = db.collection("events").doc.id;
        // var eventID = eventInfo.data().eventID;
        messageRef
          .update({
            message_description:
              document.getElementById("messageDescription").value,
            last_updated: new Date(),
          })
          .then(() => {
            // Show alert when message is posted successfully
            swal({
              title: "Message updated!",
              text: "Message was successfully updated.",
              type: "success",
              confirmButtonColor: "#e1ae17",
              confirmButtonText: "Ok",
            });
            location.reload();
            // Need to add a fresh read of new message later
            // window.location.href = "event_detail.html/" + eventID;
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
// No time to create an edit message button. :(
// var editMessageStart = document.getElementById("editOptionAllowed");
// editMessageStart.addEventListener("click", () => {});
function writeMessage() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      //get the document for current user.
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        // var lengthOfMessageList = messageRef;
        let userName = userDoc.data().name;
        var messageRef = db.collection("messages");
        let reviewerName = userName;
        let reviewer_profile_picture = userDoc.data().profile_picture;
        // let eventDocID = db.collection("events").doc.id;
        console.log(eventID);
        // var eventID = eventInfo.data().eventID;
        messageRef
          .add({
            reviewer_profile_picture: reviewer_profile_picture,
            userID: userID,
            eventID: eventID,
            reviewer_name: reviewerName,
            message_description:
              document.getElementById("messageDescription").value,
            message_created_at: new Date(),
            last_updated: new Date(),
          })
          .then(() => {
            // Show alert when message is posted successfully
            swal({
              title: "Message posted!",
              text: "Message was successfully posted.",
              type: "success",
              confirmButtonColor: "#e1ae17",
              confirmButtonText: "Ok",
            });
            appendMessages();
            // Need to add a fresh read of new message later
            // window.location.href = "event_detail.html/" + eventID;
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
