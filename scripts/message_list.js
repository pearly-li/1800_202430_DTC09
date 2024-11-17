// Plan: Need to redirect user to the message list, and automatically redirect them there upon submitting
// Next, they can view the messages related to the hike.
// Then there's an add message button that takes them back to the original page.
var params = new URL(window.location.href);
var messageID = params.searchParams.get("docID");
var eventRef = db.collection("events");
var messageRef = db.collection("messages");

function getEventTitle(eventID) {
  eventRef
    .doc(eventID)
    .get()
    .then((thisEvent) => {
      var eventTitle = thisEvent.data().title;
      document.getElementById("eventTitle").innnerHTML = eventTitle;
    });
}

function getEventDateTime(eventID) {
  eventRef
    .doc(eventID)
    .get()
    .then((thisEvent) => {
      var eventDateTime = thisEvent.data().dateTime;
      document.getElementById("eventDateTime").innnerHTML = eventDateTime;
    });
}
// This grabs the messages that belong to this user, and orders the messages by the event title and message_created_at date.
function viewMessageList() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      let messageListTemplate = document.getElementsByID("messageListTemplate"); //Retrieve the HTML element with the ID "messageListGroup" and store it in the messageListTemplate variable.

      messageRef
        .where("userID", "==", userID)
        .orderBy("message_created_at")
        .get()
        .then()((allMessages) => {
        allMessages.forEach((doc) => {
          // getEventTitle(eventID);
          // getEventDateTime(eventID);
          let messageGroup = messageListTemplate.content.cloneNode(true);
          messageGroup.querySelector("eventDateTime").innnerHTML =
            eventDateTime;
          messageGroup.querySelector("eventTitle").innnerHTML = eventTitle;
          eventCardGroup.appendChild(messageGroup);
        });
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      alert("You must be signed in to post a message.");
    }
  });
}
viewMessageList();

// This shows up when you select the message collection by event and you see all the whole message list for said event.
function viewMessageCard(messages) {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      let messageCardTemplate = document.getElementsByID("messageCardTemplate"); //Retrieve the HTML element with the ID "messageCardTemplate" and store it in the messageCardTemplate variable.

      db.collection(messages).get().then()((allMessages) => {
        allMessages.forEach((doc) => {
          var reviewer_name = doc.data().reviewer_name;
          var last_updated = doc.data().last_updated;
          var message_created_at = doc.data().message_created_at;
          var message_description = doc.data().message_description;

          let messageCard = messageCardTemplate.content.cloneNode(true);
          getEventTitle(eventID);
          messageCard.querySelector(".message_created_at").innerHTML = new Date(
            message_created_at
          ).toLocaleString();
          messageCard.querySelector(".last_updated").innerHTML = new Date(
            last_updated
          ).toLocaleString();
          messageCard.querySelector(".message_description").innerHTML =
            message_description;
          messageCard.querySelector(".reviewer_name").innerHTML = reviewer_name;
          document.getElementById("messages_go_here").appendChild(newcard);
        });
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      alert("You must be signed in to view your messages.");
    }
  });
}
viewMessageCard(messages);
