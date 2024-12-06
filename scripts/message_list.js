// Plan: Need to redirect user to the message list, and automatically redirect them there upon submitting
// Next, they can view the messages related to the hike.
// Then there's an add message button that takes them back to the original page.
var params = new URL(window.location.href);
var eventRef = db.collection("events");

var messageIDList = []

// function editMessageAllowed() { }

// // This grabs the messages that are associated with the event and orders the messages by message_created_at date.
// function populateMessages() {
//   console.log("test");
//   // let messageCardTemplate = document.getElementsByID("messageCardTemplate"); //Retrieve the HTML element with the ID "messageListTemplate" and store it in the messageListTemplate variable.
//   var messageCardGroup = document.getElementById("messageCardGroup");
//   var messageRef = db.collection("messages");
//   messageRef
//     .where("eventID", "==", eventID)
//     .orderBy("message_created_at")
//     .get()
//     .then((allMessages) => {
//       messages = allMessages.docs;
//       console.log(messages);
//       messages.forEach((doc) => {
//         var reviewer_name = doc.data().reviewer_name;
//         // var last_updated = doc.data().last_updated;
//         var message_description = doc.data().message_description;
//         let messageCard = messageCardTemplate.content.cloneNode(true);
//         messageCard.querySelector("#message_created_at").innerHTML = doc
//           .data()
//           .message_created_at.toDate()
//           .toLocaleString();
//         messageCard.querySelector("#messageDescriptionPosted").innerHTML =
//           message_description;
//         messageCard.querySelector("#reviewer_name").innerHTML = reviewer_name;
//         let reviewerPicture = doc.data().reviewer_profile_picture;
//         if (reviewerPicture) {
//           messageCard.querySelector(
//             "#reviewer_picture"
//           ).src = `images/${reviewerPicture}`;
//         }
//         messageCardGroup.appendChild(messageCard);
//       });
//     });
// }
// populateMessages();

// function appendMessages() {
//   var messageCardGroup = document.getElementById("messageCardGroup");
//   var messageRef = db.collection("messages");
//   messageRef
//     .where("eventID", "==", eventID)
//     .orderBy("message_created_at")
//     .get()
//     .then((doc) => {
//       var reviewer_name = doc.data().reviewer_name;
//       // var last_updated = doc.data().last_updated;
//       var message_description = doc.data().message_description;
//       document.getElementById("eventTitle").innerText = title;
//       // Clear out the "type your message here" field
//       messageCard.getElementById("messageDescription").value = "";
//       let messageCard = messageCardTemplate.content.cloneNode(true);
//       messageCard.querySelector("#message_created_at").innerHTML = doc
//         .data()
//         .message_created_at.toDate()
//         .toLocaleString();
//       messageCard.querySelector("#messageDescriptionPosted").innerHTML =
//         message_description;
//       messageCard.querySelector("#reviewer_name").innerHTML = reviewer_name;
//       let reviewerPicture = doc.data().reviewer_profile_picture;
//       if (reviewerPicture) {
//         messageCard.querySelector(
//           "#reviewer_picture"
//         ).src = `images/${reviewerPicture}`;
//       }
//       messageCardGroup.appendChild(messageCard);
//     });
// }

// // listofmessageIDs = [];

// // listofmessageIDs.forEach((ID) => {
// //   appendMessages(ID);
// // });

// // appendMessages(listofmessageIDs[-1]);


async function loadEventMessages() {
  messageIDList = []

  return db.collection("messages")
    .orderBy("message_created_at_for_order")
    .get()
    .then(allMessages =>
      allMessages.forEach(doc => {
        if (doc.data().eventID == eventID) {
          messageIDList.push(doc.id)
        }
      })
    );
}

function appendMessageCards(docID) {
  db.collection("messages").doc(docID)
    .get()
    .then((doc) => {
      cardTemplate = document.getElementById("messageCardTemplate")

      reviewer_name = doc.data().reviewer_name;
      message_description = doc.data().message_description;
      profile_pic = doc.data().reviewer_profile_picture
      newCard = cardTemplate.content.cloneNode(true);

      today = new Date();
      yesterday = new Date()
      tomorrow = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      tomorrow.setDate(yesterday.getDate() + 1)
      
      todayEachComponent = getDateList(today)
      tomorrowEachComponent = getDateList(tomorrow)
      yesterdayEachComponent = getDateList(yesterday)

      message_date_components = doc.data().message_created_at
      display_date = checkIfTodayOrTomorrowOrYesterday(todayEachComponent, tomorrowEachComponent, yesterdayEachComponent, message_date_components)
      time_display = formatTimeAgo(display_date, todayEachComponent, message_date_components)

      console.log(todayEachComponent)
      console.log(message_date_components)
      console.log(display_date)
      console.log(time_display)
      
      // Clear out the "type your message here" field
      document.getElementById("messageDescription").value = "";
      

      newCard.querySelector(".reviewer_name").innerHTML = reviewer_name;
      newCard.querySelector(".message_created_at").innerHTML = `${display_date}<br>${time_display}`;
      newCard.querySelector(".messageDescriptionPosted").innerHTML = message_description;
      newCard.querySelector('img').src = `images/${profile_pic}`
      
      document.getElementById("messageCardGroup").appendChild(newCard);
    });
}

async function clickSubmitMessage() {
  await writeMessage()
  await loadEventMessages()

  document.getElementById("messageCardGroup").innerHTML = ""

  console.log(messageListLengthOnLoad)
  await messageIDList.forEach(ID => {
    appendMessageCards(ID)
  })

  console.log(messageListLengthOnLoad)

}

async function setup() {
  await loadEventMessages()
  messageListLengthOnLoad = messageIDList.length

  if(messageIDList.length != []) {
    document.getElementById("messageCardGroup").innerHTML = ""
    await messageIDList.forEach(ID => {
      appendMessageCards(ID)
    })
  } else {
    document.getElementById("messageCardGroup").innerHTML = `
    <p class="mx-auto my-[200px] text-center">
      No messages posted.
    </p>`
  }
  console.log(messageListLengthOnLoad)
}
setup()