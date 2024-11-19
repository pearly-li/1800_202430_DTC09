function displayEventInfo() {
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"
  console.log(ID);

  // doublecheck: is your collection called "Reviews" or "reviews"?
  db.collection("events")
    .doc(ID)
    .get()
    .then((doc) => {
      thisEvent = doc.data();
      eventCode = thisEvent.code;
      eventName = doc.data().name;

      // only populate title, and image
      document.getElementById("eventName").innerHTML = eventName;
      let imgEvent = document.querySelector(".event-img");
      imgEvent.src = "../images/" + eventCode + ".jpg";
    });
}
displayEventInfo();

function saveEventDocumentIDAndRedirect() {
  let params = new URL(window.location.href); //get the url from the search bar
  let ID = params.searchParams.get("docID");
  localStorage.setItem("eventDocID", ID);
  window.location.href = "event_detail.html"; // This might be wrong since we don't have a separate page for messages yet.
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
