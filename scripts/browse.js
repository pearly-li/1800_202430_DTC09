var LIST_ALL_EVENTS = []
var eventBrowsingList = []
var eventBrowsingListSize = eventBrowsingList.length
console.log(`LIST_ALL_EVENTS: ${LIST_ALL_EVENTS} \neventBrowsingList: ${eventBrowsingList} \neventBrowsingListSize: ${eventBrowsingListSize}`)

var currentEventPageNumber = 1
var maxEventPageNumber = 1

console.log("Default Values")
var filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase()
console.log(document.getElementById("default-search").value.toLowerCase())
var filterEventSize = document.getElementById("size").value
console.log(document.getElementById("size").value)
var filterEventType = document.getElementById("type").value
console.log(document.getElementById("type").value)
var filterEventDate = document.getElementById("date").value
console.log(document.getElementById("date").value)


let filterSearchBtn = document.getElementById("searchEvent")
filterSearchBtn.addEventListener("click", clickFilterButton)

let removeFilterBtn = document.getElementById("removeFilters")
removeFilterBtn.addEventListener("click", clickRemoveFiltersButton)

function clickFilterButton() {
    console.log(`REFRESH=================`)
    filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase()
    filterEventSize = document.getElementById("size").value
    filterEventType = document.getElementById("type").value
    filterEventDate = document.getElementById("date").value

    filterResults()
    console.log("Filtered list")
    console.log(eventBrowsingList)

    eventBrowsingListSize = eventBrowsingList.length
    maxEventPageNumber = Math.ceil(eventBrowsingListSize / 10)

    updateNavbarButtons()
    displayResults()
    console.log(`LIST_ALL_EVENTS: ${LIST_ALL_EVENTS} \neventBrowsingList: ${eventBrowsingList} \neventBrowsingListSize: ${eventBrowsingListSize}`)

}

function clickRemoveFiltersButton() {
    eventBrowsingList = LIST_ALL_EVENTS;
    clickFilterButton()
}


function loadAllEvents() {
    return db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                LIST_ALL_EVENTS.push(doc.id)
                console.log("LIST_ALL_EVENTS")
                console.log(LIST_ALL_EVENTS)
            }));
}

function filterResults() {
    LIST_ALL_EVENTS.forEach(docID => {
        db.collection("events").doc(docID)
            .get()
            .then(doc => {
                let dateTime = new Date(doc.data().dateTime);
                let dateEachComponent = getDateList(dateTime)
                let today = new Date();
                let todayEachComponent = getDateList(today)

                if (!(compareDates(todayEachComponent, dateEachComponent))) {
                    eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                } else {
                    if (filterEventSearchKeyword != "") {
                        keywords = doc.data().title.toLowerCase().split(" ")
                        console.log(`!(keywords.includes(filterEventSearchKeyword))`)
                        console.log(!(keywords.includes(filterEventSearchKeyword)))
                        if (!(keywords.includes(filterEventSearchKeyword))) {
                            console.log(docID)
                            eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                            console.log(eventBrowsingList)
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

                    if (filterEventDate != "") {
                        let filterEventDateEachComponent = getDateList(`${filterEventDate}, 0:00`)
                        console.log("filterEventDateEachComponent")
                        console.log(filterEventDateEachComponent)
                        if (!(compareDates(filterEventDateEachComponent, dateEachComponent))) {
                            eventBrowsingList = eventBrowsingList.filter(id => id !== docID)
                        }
                    }

                }
            })
    });
}



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
    }

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
        if (document.getElementById(`navBtn${button.id}`)) {
            document.getElementById(`navBtn${button.id}`).addEventListener("click", () => {
                currentEventPageNumber = parseInt(button.text)
                console.log(currentEventPageNumber)
                updateNavbarButtons()
            }
            )
        }
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

    createPageBtn()

    if (document.getElementById(`navBtn${currentEventPageNumber}`)) {
        let currentPageBtn = document.getElementById(`navBtn${currentEventPageNumber}`)
        currentPageBtn.classList.add("bg-slate-200", "hover:bg-slate-400")
        currentPageBtn.disabled = true;
    }

    if (maxEventPageNumber <= currentEventPageNumber) {
        console.log("hide next")
        btn = document.getElementById("nextBtn")
        btn.classList.add("hidden")
        console.log("hide prev")
        btn = document.getElementById("prevBtn")
        btn.classList.add("hidden")
    } else if (currentEventPageNumber == 1) {
        console.log("hide prev")
        btn = document.getElementById("prevBtn")
        btn.classList.add("hidden")
    } else if (currentEventPageNumber == maxEventPageNumber) {
        console.log("hide next")
        btn = document.getElementById("nextBtn")
        btn.classList.add("hidden")
    }


}



function displayResults() {
    if (eventBrowsingListSize != 0) {
        document.getElementById("browsing_list").innerHTML = "";

        var cardTemplate = document.getElementById("event_card_template");

        index = (currentEventPageNumber * 10) - 10
        maxIndex = currentEventPageNumber * 10

        if (currentEventPageNumber * 10 > eventBrowsingListSize) {
            maxIndex = index + (eventBrowsingListSize % 10)
        }

        console.log(`index: ${index}, maxIndex: ${maxIndex}`)


        for (index; index < maxIndex; index++) {
            eventDocID = eventBrowsingList[index]

            db.collection("events").doc(eventDocID)
                .get()
                .then(doc => {
                    dateTime = new Date(doc.data().dateTime);
                    dateEachComponent = getDateList(dateTime)
                    today = new Date();
                    todayEachComponent = getDateList(today)

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
                })
        }

    } else {
        document.getElementById("browsing_list").innerHTML = `<p class="mx-auto my-20">No Events Found.</p>`
    }

}



function setup() {
    console.log("Setup")
    loadAllEvents().then(() => {
        eventBrowsingList = LIST_ALL_EVENTS;
        filterResults()
    
        eventBrowsingListSize = eventBrowsingList.length
        maxEventPageNumber = Math.ceil(eventBrowsingListSize / 10)
        console.log(Math.ceil(eventBrowsingListSize / 10))
        console.log(eventBrowsingList)
    
    
        updateNavbarButtons()
        displayResults()
        console.log(`LIST_ALL_EVENTS: ${LIST_ALL_EVENTS} \neventBrowsingList: ${eventBrowsingList} \neventBrowsingListSize: ${eventBrowsingListSize}`)
    })

}
setup()