var params = new URL(window.location.href);
var eventID = params.searchParams.get("docID")
var title;
var time;
var date;

function attendEvent() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var eventList = db.collection("users").doc(user.uid).collection("event");
            if (pressAttend === 0){
                eventList.add({
                    postID: eventID,
                    title: title,
                    time: time,
                    date: date
                })
            } else {
                var findInfo = db.collection('users').doc(user.uid).collection("event").where('postID', '==', eventID);
                findInfo.get().then(doc => doc.forEach(all => {all.ref.delete()}))
            }
        } else {
            console.log("Error, no user signed in");
        }
    });
}

function structureDate(month, day) {
    var ordinal = "th"
    if (day in [1, 21, 31]) {
        ordinal = "st"
    } else if (day in [2, 22]) {
        ordinal = "nd"
    } else if (day in [3, 23]) {
        ordinal = "rd"
    }

    monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    month = monthNames[month]
    date = `${month} ${day}${ordinal}`;

    return date
}

function createEventDetail() {
    
    db.collection("events")
    .doc(eventID)
    .get()
    .then(eventInfo => {
        title = eventInfo.data().title;
        var location = eventInfo.data().location;
        var description = eventInfo.data().description;
        var scale = eventInfo.data().scale;
        var image = eventInfo.data().image;
        date = new Date(`${eventInfo.data().date}, ${eventInfo.data().time}`);

        // Code to display time
        var event_hour = date.getHours()
        var event_minute = date.getMinutes()
        var timeSuffix = "AM"
        if (event_hour == 0) {
            event_hour = 12
        } else if (event_hour > 12) {
            event_hour -= 12
            timeSuffix = "PM"
        }
        time = `${event_hour}:${event_minute} ${timeSuffix}`

        // Code to display date
        var month = date.getMonth();
        var day = date.getDate();

        var today = new Date();
        var currentYear = today.getFullYear();
        var currentMonth = today.getMonth();

        maxDays = 31
        if (currentMonth in [4, 6, 9, 11]) {
            maxDays = 30;
        } else if (currentYear % 4 == 0) {
            maxDays = 29
        } else if (currentMonth == 2) {
            maxDays = 28
        }

        date = structureDate(month, day);
        
        document.getElementById('eventImg').src = image;
        document.getElementById('eventTitle').innerText = title;
        document.getElementById('eventDescription').innerText = description;
        document.getElementById('eventParticipation').innerText = scale;
        document.getElementById('eventAddress').innerText = location;
        document.getElementById('eventTime').innerText = date + ", " + time;
    })  
}
createEventDetail()

pressLike = 1
function fillLike() {
    if (pressLike == 1) {
        document.getElementById('like').src = "./images/f_heart.png"
        pressLike--;
    }
    else {
        document.getElementById('like').src = "./images/heart.png"
        pressLike++;
    }
}

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

function hostOrNot() {
    var userEvent = db.collection("users");
    var footerNavDesign = document.getElementById('footerNav')
    if (userEvent.where('myposts', '==', eventID)) {
        footerNavDesign.innerHTML = `<section class="flex gap-5 my-4 justify-center">
        <h1 class="text-white font-bold text-[20px]">You're the host of the event</h1>
        <img src="./images/chat.png" class="w-[30px] h-[30px]"></section>`

    } else {
        footerNavDesign.innerHTML = `<section class="flex my-4 justify-center gap-5 items-center">
            <button class="bg-white rounded-[5px] px-20 font-bold text-xl min-w-[224px] min-h-[40px]" id="attendBtn">Attend</button>
            <img src="./images/chat.png" class="w-[30px] h-[30px]">
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
}
hostOrNot()