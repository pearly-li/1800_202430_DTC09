var LIST_ALL_EVENTS = []
var eventBrowsingList = []
var eventBrowsingListSize = eventBrowsingList.length

var currentEventPageNumber = 1
var maxEventPageNumber = 1


var filterEventSearchKeyword = ""
var filterEventSize = ""
var filterEventType = ""
var filterEventDate = ""

let filterSearchBtn = document.getElementById("searchEvent")
filterSearchBtn.addEventListener("click", () => {
    filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase()
    filterEventSize = document.getElementById("size").value
    filterEventType = document.getElementById("type").value
    filterEventDate = document.getElementById("date").value

    eventBrowsingList = LIST_ALL_EVENTS;
    filterResults()
    eventBrowsingListSize = eventBrowsingList.length
    maxEventPageNumber = Math.ceil(eventBrowsingListSize / 10)

    updateNavbarButtons()
    displayResults()
})


function loadAllEvents() {
    db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                LIST_ALL_EVENTS.push(doc.id)
                console.log(LIST_ALL_EVENTS)
            }));
}

function filterResults() {
    LIST_ALL_EVENTS.forEach(docID => {
        db.collection("events").doc(docID)
            .get()
            .then(doc => {
                if (filterEventSearchKeyword != "") {
                    keywords = doc.data().title.toLowerCase().split(" ")
                    if (!(keywords.includes(filterEventSearchKeyword))) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                }

                if (filterEventSize == "one on one") {
                    console.log("Filter by size")
                    if (doc.data().scale != 1) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (filterEventSize == "small") {
                    if (doc.data().scale < 2 || doc.data().scale > 6) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (filterEventSize == "medium") {
                    if (doc.data().scale < 7 || doc.data().scale > 12) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (filterEventSize == "large") {
                    if (doc.data().scale < 13) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                }

                if (filterEventSize == "in person") {
                    console.log("Filter by type")
                    if (doc.data().scale != "in person") {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (filterEventSize == "virtual") {
                    if (doc.data().scale != "virtual") {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }

                    if (filterEventDate != "") {
                        dateTime = new Date(doc.data().dateTime);
                        dateEachComponent = getDateList(dateTime);
                        eventDateTime = new Date(`${filterEventDate}, 0:00`);
                        eventDateTimeEachComponent = getDateList(eventDateTime)

                        if (!(dateEachComponent.year === eventDateTimeEachComponent.year &&
                            dateEachComponent.month === eventDateTimeEachComponent.month &&
                            dateEachComponent.day === eventDateTimeEachComponent.day)) {
                            eventBrowsingList = eventBrowsingList.filter(id => id !== docID);
                        }
                    }
                }
            })

    });
<<<<<<< HEAD

    console.log(eventBrowsingList)
    console.log("len")
    console.log(eventBrowsingList.length)
=======
>>>>>>> 8caa4e99180f5fdc1f8293dd106faf9e749a93ba

    eventBrowsingListSize = eventBrowsingList.length
    maxEventPageNumber = Math.ceil(eventBrowsingListSize / 10)
}



<<<<<<< HEAD
// Arrays of the navbar buttons 
firstNavButtons = [
    { "id": "prevBtn", "text": "<", "class": "navBtn" }
]
lastNavButtons = [
    { "id": "nextBtn", "text": ">", "class": "navBtn" }
]

=======
>>>>>>> 8caa4e99180f5fdc1f8293dd106faf9e749a93ba
function createAndAppendBtn(id, text, className) {
    navbar = document.getElementById("pagination_navbar")

    btn = document.createElement(`button`)
    btn.id = id
    btn.classList = `${className} border-none py-1 px-3`
    btn.innerHTML = text

    navbar.appendChild(btn)
}

function createPageBtn() {
    console.log("Mkn Btns")
    buttonList = []
    index = currentEventPageNumber
    maxIndex = currentEventPageNumber
    console.log(maxIndex)

    if (index + 4 > maxEventPageNumber) {
        maxIndex += maxEventPageNumber - currentEventPageNumber
        console.log(currentEventPageNumber)
        console.log(maxEventPageNumber)
        console.log(maxEventPageNumber - currentEventPageNumber)
        console.log(maxIndex)
    } else {
        maxIndex += 4
<<<<<<< HEAD
    }



=======
    }    
    
>>>>>>> 8caa4e99180f5fdc1f8293dd106faf9e749a93ba
    for (index; index <= maxIndex; index++) {
        buttonList.push({ "id": `${index}`, "text": `${index}`, "class": "pageBtn" })
    }


    console.log(buttonList)

    
    createAndAppendBtn("prevBtn", "<", "navBtn")
    document.getElementById("prevBtn").addEventListener("click", () => {
        currentEventPageNumber -= 1
        console.log(currentEventPageNumber)
        updateNavbarButtons()
    })

    buttonList.forEach(button => {
        createAndAppendBtn(button.id, button.text, button.class)
        document.getElementById(`navBtn${button.id}`).addEventListener("click", () => {
            currentEventPageNumber = parseInt(button.text)
            console.log(currentEventPageNumber)
            updateNavbarButtons()
        })
    })
    
    createAndAppendBtn("nextBtn", ">", "navBtn")
    document.getElementById("nextBtn").addEventListener("click", () => {
        currentEventPageNumber += 1
        console.log(currentEventPageNumber)
        updateNavbarButtons()
    })
}

function updateNavbarButtons() {
    // Resets the navbar
    document.getElementById("pagination_navbar").innerHTML = ""
<<<<<<< HEAD

    firstNavButtons.forEach(button => createAndAppendBtn(button.id, button.text, button.class))

    createPageBtn()

    lastNavButtons.forEach(button => createAndAppendBtn(button.id, button.text, button.class))
=======
>>>>>>> 8caa4e99180f5fdc1f8293dd106faf9e749a93ba

    createPageBtn()

    let currentPageBtn = document.getElementById(`navBtn${currentEventPageNumber}`)
    currentPageBtn.classList.add("bg-slate-200", "hover:bg-slate-400")
    currentPageBtn.disabled = true;


    if (currentEventPageNumber == 1) {
        console.log("hide prev")
        btn = document.getElementById("prevBtn")
        btn.classList.add("hidden")
    }
    else if (currentEventPageNumber == maxEventPageNumber) {
        console.log("hide next")
        btn = document.getElementById("nextBtn")
        btn.classList.add("hidden")
    }

    
}



function displayResults() {
    document.getElementById("browsing_list").innerHTML = "";

    var cardTemplate = document.getElementById("event_card_template");

    index = (currentEventPageNumber * 10) - 10
    maxIndex = currentEventPageNumber * 10

    if (currentEventPageNumber * 10 > eventBrowsingListSize) {
        maxIndex = index + (eventBrowsingListSize % 10)
    }

    for (index; index < maxIndex; index++) {
        eventDoc = eventBrowsingList[index]

        db.collection("events").doc(eventDoc)
            .get()
            .then(doc => {
                dateTime = new Date(doc.data().dateTime);
                dateEachComponent = getDateList(dateTime)
                today = new Date();
                todayEachComponent = getDateList(today)

                if (eventBrowsingListSize != 0) {
                    if (compareDates(todayEachComponent, dateEachComponent)) {
                        title = doc.data().title;
                        image = doc.data().image
                        docID = doc.id;
                        newCard = cardTemplate.content.cloneNode(true);

                        newCard.querySelector(".event_card_title").innerHTML = title;
                        newCard.querySelector(".event_card_date").innerHTML = checkIfTodayOrTomorrow(todayEachComponent, dateEachComponent);
                        newCard.querySelector(".event_card_time").innerHTML = formatTime(dateEachComponent);
                        newCard.querySelector('img').src = image;
                        newCard.querySelector('a').href = "event_detail.html?docID=" + docID;

                        document.getElementById("browsing_list").appendChild(newCard);

                    }
                }
                else {
                    document.getElementById("browsing_list").innerHTML = `<p class="my-5 mx-auto">No Events Found.</p>`
                }
            })
    }
}



function setup() {
    console.log("Setup")
    loadAllEvents()
    console.log(LIST_ALL_EVENTS)

    eventBrowsingList = LIST_ALL_EVENTS;
    eventBrowsingListSize = eventBrowsingList.length
    maxEventPageNumber = Math.ceil(eventBrowsingListSize / 10)
    console.log(Math.ceil(eventBrowsingListSize / 10))

    updateNavbarButtons()
    displayResults()
}
setup()