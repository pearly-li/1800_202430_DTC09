var currentUser; //points to the document of the user who is logged in

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

function saveEventDocumentIDAndRedirect() {
  let params = new URL(window.location.href); //get the url from the search bar
  let ID = params.searchParams.get("docID");
  localStorage.setItem("eventDocID", ID);
  window.location.href = "event_detail.html";
}
function populateMessages() {
  console.log("test");
  let messageCardTemplate = document.getElementById("messageCardTemplate");
  let messageCardGroup = document.getElementById("messageCardGroup");

  let params = new URL(window.location.href); // Get the URL from the search bar
  let eventID = params.searchParams.get("docID");

  db.collection("messages")
    .where("eventDocID", "==", eventID)
    .get()
    .then((allMessages) => {
      messages = allMessages.docs;
      console.log(messages);
      messages.forEach((doc) => {
        var userName = userDoc.data().name;
        var time = doc.data().timestamp.toDate();
        var description = doc.data().message_description;

        console.log(time);

        let messageCard = messageCardTemplate.content.cloneNode(true);
        messageCard.querySelector(".userName").innerHTML = userName;
        messageCard.querySelector(".time").innerHTML = new Date(
          time
        ).toLocaleString();
        messageCard.querySelector(
          ".description"
        ).innerHTML = `Description: ${description}`;
        messageCardGroup.appendChild(messageCard);
      });
    });
}
populateMessages();

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

        messageRef.add({
          reviewer_name: userName,
          message_description:
            document.getElementById("messageDescription").value,
          message_created_at: firebase.firestore.FieldValue.serverTimestamp(),
          last_updated: firebase.firestore.FieldValue.serverTimestamp(),
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
