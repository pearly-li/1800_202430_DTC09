var LIST_ALL_EVENTS = []
var eventBrowsingList = []

var currentPage = 1
var maxPageNumber = 1


var eventSearchKeyword = ""
var eventSize = ""
var eventType = ""
var eventDate = ""

searchBtn = document.getElementById("searchEvent")
searchBtn.addEventListener("click", () => {
    eventSearchKeyword = document.getElementById("default-search").value.toLowerCase()
    eventSize = document.getElementById("size").value
    eventType = document.getElementById("type").value
    eventDate = document.getElementById("date").value

    eventBrowsingList = LIST_ALL_EVENTS;
    filterResults()
    //displayResults()
})


function loadAllEvents() {
    db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                LIST_ALL_EVENTS.push(doc.id)
            }));

    eventBrowsingList = LIST_ALL_EVENTS;
}

function filterResults() {
    LIST_ALL_EVENTS.forEach(docID => {
        db.collection("events").doc(docID)
            .get()
            .then(doc => {
                if (eventSearchKeyword != "") {
                    keywords = doc.data().title.toLowerCase().split(" ")
                    if (!(keywords.includes(eventSearchKeyword))) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                }

                if (eventSize == "one on one") {
                    console.log("Filter by size")
                    if (doc.data().scale != 1) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (eventSize == "small") {
                    if (doc.data().scale < 2 || doc.data().scale > 6) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (eventSize == "medium") {
                    if (doc.data().scale < 7 || doc.data().scale > 12) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (eventSize == "large") {
                    if (doc.data().scale < 13) {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                }

                if (eventSize == "in person") {
                    console.log("Filter by type")
                    if (doc.data().scale != "in person") {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }
                } else if (eventSize == "virtual") {
                    if (doc.data().scale != "virtual") {
                        eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                    }

                    if (eventDate != "") {
                        dateTime = new Date(doc.data().dateTime);
                        dateEachComponent = getDateList(dateTime);
                        eventDateTime = new Date(`${eventDate}, 0:00`);
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

    console.log(eventBrowsingList)
    console.log("len")
    console.log(eventBrowsingList.length)

    maxPageNumber = Math.ceil(eventBrowsingList.length / 10)
}

function displayResults() {
    var cardTemplate = document.getElementById("event_card_template");

    index = (currentPage * 10) - 10
    maxIndex = currentPage * 10

    for (index; index < maxIndex; index++) {
        eventDoc = eventBrowsingList[index]

        db.collection("events").doc(eventDoc)
            .get()
            .then(doc => {
                dateTime = new Date(doc.data().dateTime);
                dateEachComponent = getDateList(dateTime)
                today = new Date();
                todayEachComponent = getDateList(today)

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

                    if (document.getElementById("browsing_list"))
                        document.getElementById("browsing_list").appendChild(newCard);
                }
            })
    }
}



// Arrays of the navbar buttons 
firstNavButtons = [
    { "id": "prevBtn", "text": "<", "class": "navBtn" }
]
lastNavButtons = [
    { "id": "nextBtn", "text": ">", "class": "navBtn" }
]

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
    index = currentPage
    maxIndex = currentPage
    console.log(maxIndex)

    if (index + 4 > maxPageNumber) {
        maxIndex += maxPageNumber - currentPage
        console.log(currentPage)
        console.log(maxPageNumber)
        console.log(maxPageNumber - currentPage)
        console.log(maxIndex)
    } else {
        maxIndex += 4
    }



    for (index; index <= maxIndex; index++) {
        buttonList.push({ "id": `${index}`, "text": `${index}`, "class": "pageBtn" })
    }

    console.log(buttonList)

    buttonList.forEach(button => {
        createAndAppendBtn(button.id, button.text, button.class)
        document.getElementById(`navBtn${button.id}`).addEventListener("click", () => {
            currentPage = parseInt(button.text)
            console.log(currentPage)
            updateNavbarButtons()
        })
    })
}

function updateNavbarButtons() {
    // Resets the navbar
    document.getElementById("pagination_navbar").innerHTML = ""

    firstNavButtons.forEach(button => createAndAppendBtn(button.id, button.text, button.class))

    createPageBtn()

    lastNavButtons.forEach(button => createAndAppendBtn(button.id, button.text, button.class))

    var currentPageBtn = document.getElementById(`navBtn${currentPage}`)
    currentPageBtn.classList.add("bg-slate-200", "hover:bg-slate-400")
    currentPageBtn.disabled = true;


    if (currentPage == 1) {
        console.log("hide prev")
        btn = document.getElementById("prevBtn")
        btn.classList.add("hidden")
    }
    else if (currentPage == maxPageNumber) {
        console.log("hide next")
        btn = document.getElementById("nextBtn")
        btn.classList.add("hidden")
    }

    document.getElementById("prevBtn").addEventListener("click", () => {
        currentPage -= 1
        console.log(currentPage)
        updateNavbarButtons()
    })
    document.getElementById("nextBtn").addEventListener("click", () => {
        currentPage += 1
        console.log(currentPage)
        updateNavbarButtons()
    })
}

loadAllEvents()
filterResults()
updateNavbarButtons()
displayResults()