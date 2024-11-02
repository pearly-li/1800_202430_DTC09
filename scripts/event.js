function createEvent() {
    var eventInfo = db.collection("events");

    eventInfo.add({
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        location: document.getElementById("address").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        picture: document.getElementById("image").value
    });
}

event_info = document.getElementById("event_btn")
event_info.addEventListener("click", () => {
    createEvent()
})