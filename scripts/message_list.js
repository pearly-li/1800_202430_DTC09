// Plan: Need to redirect user to the message list, and automatically redirect them there upon submitting
// Next, they can view the messages related to the hike.
// Then there's an add message button that takes them back to the original page.
var params = new URL(window.location.href);
var messageID = params.searchParams.get("docID");
var eventRef = db.collection("events");

// function getEventTitle(eventID) {
//   eventRef
//     .doc(eventID)
//     .get()
//     .then((thisEvent) => {
//       var eventTitle = thisEvent.data().title;
//       document.getElementById("eventTitle").innnerHTML = eventTitle;
//     });
// }

// function getEventDateTime(eventID) {
//   eventRef
//     .doc(eventID)
//     .get()
//     .then((thisEvent) => {
//       var eventDateTime = thisEvent.data().dateTime;
//       document.getElementById("eventDateTime").innnerHTML = eventDateTime;
//     });
// }
// This grabs the messages that are associated with the event and orders the messages by message_created_at date.
function populateMessages() {
  console.log("test");
  // let messageCardTemplate = document.getElementsByID("messageCardTemplate"); //Retrieve the HTML element with the ID "messageListTemplate" and store it in the messageListTemplate variable.
  let messageCardGroup = document.getElementById("messageCardGroup");
  var messageRef = db.collection("messages");
  messageRef
    .where("eventID", "==", eventID)
    .orderBy("message_created_at")
    .get()
    .then((allMessages) => {
      messages = allMessages.docs;
      console.log(messages);
      messages.forEach((doc) => {
        var reviewer_name = doc.data().reviewer_name;
        // var last_updated = doc.data().last_updated;
        var message_description = doc.data().message_description;
        let messageCard = messageCardTemplate.content.cloneNode(true);
        messageCard.querySelector("#message_created_at").innerHTML = doc
          .data()
          .message_created_at.toDate()
          .toLocaleString();
        // messageCard.querySelector(".last_updated").innerHTML = doc
        //   .data()
        //   .last_updated.toDate()
        //   .toLocaleString();
        messageCard.querySelector("#message_description").innerHTML =
          message_description;
        messageCard.querySelector("#reviewer_name").innerHTML = reviewer_name;
        messageCardGroup.appendChild(messageCard);
      });
    });
}
populateMessages();