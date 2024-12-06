var params = new URL(window.location.href);
var eventRef = db.collection("events");

var messageIDList = [];

async function loadEventMessages() {
  messageIDList = [];

  return db
    .collection("messages")
    .orderBy("message_created_at_for_order")
    .get()
    .then((allMessages) =>
      allMessages.forEach((doc) => {
        if (doc.data().eventID == eventID) {
          messageIDList.push(doc.id);
        }
      })
    );
}

function appendMessageCards(docID) {
  db.collection("messages")
    .doc(docID)
    .get()
    .then((doc) => {
      cardTemplate = document.getElementById("messageCardTemplate");

      reviewer_name = doc.data().reviewer_name;
      message_description = doc.data().message_description;
      profile_pic = doc.data().reviewer_profile_picture;
      newCard = cardTemplate.content.cloneNode(true);

      today = new Date();
      yesterday = today;
      tomorrow = today;
      yesterday.setDate(yesterday.getDate() - 1);
      tomorrow.setDate(yesterday.getDate() + 1);

      todayEachComponent = getDateList(today);
      tomorrowEachComponent = getDateList(tomorrow);
      yesterdayEachComponent = getDateList(yesterday);

      message_date_components = doc.data().message_created_at;
      display_date = checkIfTodayOrTomorrowOrYesterday(
        todayEachComponent,
        tomorrowEachComponent,
        yesterdayEachComponent,
        message_date_components
      );
      time_display = formatTimeAgo(
        display_date,
        todayEachComponent,
        message_date_components
      );

      console.log(todayEachComponent);
      console.log(message_date_components);
      console.log(display_date);
      console.log(time_display);

      // Clear out the "type your message here" field
      document.getElementById("messageDescription").value = "";

      newCard.querySelector(".reviewer_name").innerHTML = reviewer_name;
      newCard.querySelector(
        ".message_created_at"
      ).innerHTML = `${display_date}<br>${time_display}`;
      newCard.querySelector(".messageDescriptionPosted").innerHTML =
        message_description;
      newCard.querySelector("img").src = `images/${profile_pic}`;

      document.getElementById("messageCardGroup").appendChild(newCard);
    });
}

async function clickSubmitMessage() {
  await writeMessage();
  await loadEventMessages();

  document.getElementById("messageCardGroup").innerHTML = "";

  console.log(messageListLengthOnLoad);
  await messageIDList.forEach((ID) => {
    appendMessageCards(ID);
  });

  console.log(messageListLengthOnLoad);
}

async function setup() {
  await loadEventMessages();
  messageListLengthOnLoad = messageIDList.length;

  if (messageIDList.length != []) {
    document.getElementById("messageCardGroup").innerHTML = "";
    await messageIDList.forEach((ID) => {
      appendMessageCards(ID);
    });
  } else {
    document.getElementById("messageCardGroup").innerHTML = `
    <p class="mx-auto my-[200px] text-center">
      No messages posted.
    </p>`;
  }
  console.log(messageListLengthOnLoad);
}
setup();
