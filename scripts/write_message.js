var params = new URL(window.location.href);
var eventID = params.searchParams.get("docID");

function editMessage() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        var messageRef = db.collection("messages");
        console.log(eventID);

        messageRef
          .update({
            message_description:
              document.getElementById("messageDescription").value,
            last_updated: new Date(),
          })
          .then(() => {
            // Show alert when message is posted successfully
            Swal.fire({
              title: "Message updated!",
              text: "Message was successfully updated.",
              icon: "success",
              confirmButtonColor: "#e1ae17",
              confirmButtonText: "Ok",
            });
            location.reload();
          })
          .catch((error) => {
            console.error("Error adding message: ", error);
          });
      });
    } else {
      console.log("No user is signed in");
      alert("You must be signed in to post a message.");
    }
  });
}

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
            message_created_at_for_order: new Date(),
            message_created_at: getDateList(new Date()),
          })
          .then(() => {
            // Show alert when message is posted successfully
            Swal.fire({
              title: "Message posted!",
              text: "Message was successfully posted.",
              icon: "success",
              confirmButtonColor: "#e1ae17",
              confirmButtonText: "Ok",
            });
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
