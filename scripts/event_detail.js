var params = new URL(window.location.href);
var eventID = params.searchParams.get("docID");
var title;
var dateTime;
var userEvent = db.collection("users");
var footerNavDesign = document.getElementById("footerNav");
var image;
var pressLike;
var pressAttend;

//fill the information about the event
function createEventDetail() {
  let eventRef = db.collection("events");
  eventRef
    .doc(eventID)
    .get()
    .then((eventInfo) => {
      var title = eventInfo.data().title;
      var image = eventInfo.data().image;
      var location = eventInfo.data().location;
      var description = eventInfo.data().description;
      var scale = eventInfo.data().scale;
      var participant = eventInfo.data().participants.length;

      var dateTime = new Date(eventInfo.data().dateTime);
      var dateEachComponent = getDateList(dateTime);

      document.getElementById;
      document.getElementById("eventImg").src = image;
      document.getElementById("eventTitle").innerText = title;
      document.getElementById("eventDescription").innerText = description;
      document.getElementById("eventParticipation").innerText =
        participant + "/" + scale;
      document.getElementById("eventAddress").innerText = location;
      document.getElementById("eventTime").innerText =
        formatDate(dateEachComponent) + ", " + formatTime(dateEachComponent);
    });
}
createEventDetail();

//Check whether the user pressed attend button or not
function checkUserLiked() {
  pressLike = 0;
  let imgFile = "./images/heart.png";
  firebase.auth().onAuthStateChanged(function (user) {
    userEvent
      .doc(user.uid)
      .get()
      .then((userInfo) => {
        if (userInfo.data().hasOwnProperty("likePosts")) {
          if (userInfo.data()["likePosts"].includes(eventID)) {
            imgFile = "./images/f_heart.png";
            pressLike = 1;
          }
        }
        document.getElementById("like").src = imgFile;
      });
  });
}

//if the user pressed like button, it is changed
function pressLikeBtn() {
  if (pressLike === 1) {
    document.getElementById("like").src = "./images/heart.png";
    pressLike--;
  } else {
    document.getElementById("like").src = "./images/f_heart.png";
    pressLike++;
  }
}

//If the user pressed like button, add it to the likePosts array
function likedEventCollection() {
  if (pressLike === 1) {
    firebase.auth().onAuthStateChanged(function (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          likePosts: firebase.firestore.FieldValue.arrayUnion(eventID),
        });
    });
  } else {
    firebase.auth().onAuthStateChanged(function (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          likePosts: firebase.firestore.FieldValue.arrayRemove(eventID),
        });
    });
  }
}

//Check whether the user pressed attend button or not
function checkUserAttendance() {
  pressAttend = 0;
  let text = "Attend";
  firebase.auth().onAuthStateChanged(function (user) {
    db.collection("events")
      .doc(eventID)
      .get()
      .then((eventInfo) => {
        if (eventInfo.data().hasOwnProperty("participants")) {
          if (eventInfo.data()["participants"].includes(user.uid)) {
            text = "Cancel";
            pressAttend = 1;
          }
        }
        document.getElementById("attendBtn").innerText = text;
      });
  });
}

function pressAttendBtn() {
  if (pressAttend === 1) {
    document.getElementById("attendBtn").innerText = "Attend";
    pressAttend--;
  } else {
    document.getElementById("attendBtn").innerText = "Cancel";
    pressAttend++;
  }
}

//Add information about the event user press attend button on a "event"collection under the currently signed-in user and show chat button
//Remove the information when user press cancel button and the chat button
function attendEvent() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (pressAttend === 1) {
        db.collection("users")
          .doc(user.uid)
          .update({
            eventAttend: firebase.firestore.FieldValue.arrayUnion(eventID),
          });
        db.collection("events")
          .doc(eventID)
          .update({
            participants: firebase.firestore.FieldValue.arrayUnion(user.uid),
          });
      } else {
        db.collection("users")
          .doc(user.uid)
          .update({
            eventAttend: firebase.firestore.FieldValue.arrayRemove(eventID),
          });
        db.collection("events")
          .doc(eventID)
          .update({
            participants: firebase.firestore.FieldValue.arrayRemove(user.uid),
          });
      }
    } else {
      console.log("Error, no user signed in");
    }
  });
}

//when user is not a host for the event the user is browsing, display a footer that is different from the host's footer
function notHostFooter() {
  footerNavDesign.innerHTML = `<section class="flex my-4 justify-center gap-5 items-center">
            <a href="./main.html"><img src="./images/home.svg" class="w-[30px] h-[30px]"></a>
            <button class="bg-white rounded-[5px] px-20 font-bold text-xl min-w-[224px] min-h-[40px]" id="attendBtn">Attend</button>
            <button id="likeBtn"><img src="./images/heart.png" class="w-[30px] h-[30px]" id="like"></button>
        </section>`;
  checkUserLiked();
  checkUserAttendance();
  like_btn = document.getElementById("likeBtn");
  like_btn.addEventListener("click", () => {
    pressLikeBtn();
    likedEventCollection();
  });

  attend_btn = document.getElementById("attendBtn");
  attend_btn.addEventListener("click", () => {
    pressAttendBtn();
    attendEvent();
  });
}

//check if the user is a host for the event the user is browsing
//if the user is a host for the event, display specific footer for the host
function hostOrNot() {
  firebase.auth().onAuthStateChanged(function (user) {
    userEvent
      .doc(user.uid)
      .get()
      .then((userInfo) => {
        if (userInfo.data().hasOwnProperty("myposts")) {
          //check if the user has "myposts" field
          if (userInfo.data()["myposts"].includes(eventID)) {
            //check if the user has the eventID in the "myposts" field
            footerNavDesign.innerHTML = `<section class="flex gap-3 my-4 justify-between px-3 items-center">
                    <a href="./main.html"><img src="./images/home.svg" class="w-[30px] h-[30px]"></a>
                    <button class="bg-white rounded-[5px] font-bold text-xl px-5 min-h-[40px]" id="deleteBtn">Delete The Event</button></section>`;
          } else {
            notHostFooter();
          }
        } else {
          notHostFooter();
        }
      });
  });
}
hostOrNot();
