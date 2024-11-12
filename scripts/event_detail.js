var params = new URL(window.location.href);
var eventID = params.searchParams.get("docID")
var title;
var time;
var date;
var userEvent = db.collection("users");
var footerNavDesign = document.getElementById('footerNav');
var image

//Add information about the event user press attend button on a "event"collection under the currently signed-in user and show chat button
//Remove the information when user press cancle button and the chat button
function attendEvent() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var eventList = db.collection("users").doc(user.uid).collection("event");
            if (pressAttend === 0){
                eventList.add({
                    postID: eventID,
                    title: title,
                    time: time,
                    date: date,
                    image: image
                })
                chatImg.classList.remove(
                    `hidden`,
                )
            } else {
                var findInfo = db.collection('users').doc(user.uid).collection("event").where('postID', '==', eventID);
                findInfo.get().then(doc => doc.forEach(all => {all.ref.delete()}))
                chatImg.classList.add(
                    `hidden`,
                )
            }
        } else {
            console.log("Error, no user signed in");
        }
    });
}

//fill the information about the event
function createEventDetail() {
    db.collection("events")
    .doc(eventID)
    .get()
    .then(eventInfo => {
        title = eventInfo.data().title;
        var location = eventInfo.data().location;
        var description = eventInfo.data().description;
        var scale = eventInfo.data().scale;
        image = eventInfo.data().image;
        date = eventInfo.data().date;
        time = eventInfo.data().time;
        var participant = eventInfo.data().participants.length;
        
        document.getElementById('eventImg').src = image;
        document.getElementById('eventTitle').innerText = title;
        document.getElementById('eventDescription').innerText = description;
        document.getElementById('eventParticipation').innerText = participant + "/" + scale;
        document.getElementById('eventAddress').innerText = location;
        document.getElementById('eventTime').innerText = date + ", " + time;
    })  
}
createEventDetail()

//When a user presses the like button, it changes to a red like button
//When a user presses the red like button, it changes to a white like button
pressLike = 1
function fillLike() {
    if (pressLike == 1) {
        document.getElementById('like').src = "./images/f_heart.png"
        pressLike--;
        firebase.auth().onAuthStateChanged(function (user){
                db.collection("users").doc(user.uid).update({
                likePosts: firebase.firestore.FieldValue.arrayUnion(eventID)
            })
        })
    }
    else {
        document.getElementById('like').src = "./images/heart.png"
        pressLike++;
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).update({
                likePosts: firebase.firestore.FieldValue.arrayRemove(eventID)
            })
        })
    }
}

//When a user presses the attend button, it changes to a cancle button
//When a user presses the cancle button, it changes to a attend button
pressAttend = 1
function attendBtn() {
    if (pressAttend == 1) {
        document.getElementById('attendBtn').innerText = "Cancle"
        pressAttend--;
    }
    else {
        document.getElementById('attendBtn').innerText = "Attend"
        pressAttend++;
    }
    attendEvent();
}

//when user is not a host for the event the user is browsing, display a footer that is different from the host's footer
function notHostFooter(){
    footerNavDesign.innerHTML = `<section class="flex my-4 justify-center gap-5 items-center">
            <button class="bg-white rounded-[5px] px-20 font-bold text-xl min-w-[224px] min-h-[40px]" id="attendBtn">Attend</button>
            <button><img id="chatImg" src="./images/chat.png" class="w-[30px] h-[30px] hidden"></button>
                <button id="likeBtn"><img src="./images/heart.png" class="w-[30px] h-[30px]" id="like"></button>
        </section>`
    like_btn = document.getElementById("likeBtn")
    like_btn.addEventListener("click", () => {
        fillLike();
    })

    attend_btn = document.getElementById("attendBtn")
    attend_btn.addEventListener("click", () => {
        attendBtn();
    })
}

//check if the user is a host for the event the user is browsing
//if the user is a host for the event, display specific footer for the host
function hostOrNot() {
    firebase.auth().onAuthStateChanged(function (user){
        userEvent.doc(user.uid)
        .get()
        .then(userInfo => {
            if(userInfo.data().hasOwnProperty("myposts")){
                if(userInfo.data()["myposts"].includes(eventID)){
                    footerNavDesign.innerHTML = `<section class="flex gap-5 my-4 justify-center">
                    <h1 class="text-white font-bold text-[20px]">You're the host of the event</h1>
                    <button><img src="./images/chat.png" class="w-[30px] h-[30px]"></button></section>`
                }else{
                    notHostFooter();
                }
            }else{
                notHostFooter();
            }
        })
    })
}
hostOrNot()