var editOrNot = localStorage.getItem("editOrNot");
console.log(editOrNot);
if (editOrNot == 1) {
  var params = new URL(window.location.href);
  var eventID = params.searchParams.get("docID");
  loadingInfo();
  localStorage.removeItem("editOrNot");
  const button = document.getElementById("create_event_btn");
  button.id = "edit_event_btn";

  var click_edit_btn = document.getElementById("edit_event_btn");
  click_edit_btn.addEventListener("click", () => {
    editEvent(eventID);
  });
}
function loadingInfo() {
  let eventRef = db.collection("events");
  eventRef
    .doc(eventID)
    .get()
    .then((eventInfo) => {
      var title = eventInfo.data().title;
      var image = eventInfo.data().image;
      var location = eventInfo.data().location;
      var description = eventInfo.data().description;
      var maximumParticipants = eventInfo.data().maximumParticipants;
      var activitylevel = eventInfo.data().activtyLevel;
      var date = eventInfo.data().dateTime;
      var categoryvalue = eventInfo.data().category;
      var typeEventValue = eventInfo.data().typeOfEvent;

      document.getElementById("title").value = title;
      document.getElementById("description").value = description;
      category.options[category.selectedIndex].value = categoryvalue;
      document.getElementById("activityLevel").value = activitylevel;
      document.getElementById("address").value = location;
      document.getElementById("maximumParticipants").value =
        maximumParticipants;
      document.getElementById("dateTime").value = date;
      document.getElementById("typeEvent").value = typeEventValue;

      if (image === "./images/no_img.jpg") {
        document.getElementById("defaultImg").checked = true;
      } else {
        document.getElementById("user_pic").src = image;
      }
      document.getElementById("edit_event_btn").innerText = "Edit";
    });
}
