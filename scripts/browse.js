var eventBrowsingList = []
var eventBrowsingListSize = eventBrowsingList.length

var currentEventPageNumber = 1
var maxEventPageNumber = 1

var filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase()
var filterEventSize = document.getElementById("size").value
var filterEventType = document.getElementById("type").value
var filterEventDate = document.getElementById("date").value

var todayEachComponent = getDateList(new Date())

let filterSearchBtn = document.getElementById("searchEvent")
filterSearchBtn.addEventListener("click", clickFilterButton)

let removeFilterBtn = document.getElementById("removeFilters")
removeFilterBtn.addEventListener("click", clickRemoveFiltersButton)

async function clickFilterButton() {
    currentEventPageNumber = 1

    console.log("Start")
    await loadAllEvents()

    console.log(2)
    filterEventSearchKeyword = await document.getElementById("default-search").value.toLowerCase()
    filterEventSize = await document.getElementById("size").value
    filterEventType = await document.getElementById("type").value
    filterEventDate = await document.getElementById("date").value

    await filterResults()
    console.log(4)

    updateNavbarButtons()
    displayResults()
}

function clickRemoveFiltersButton() {
    document.getElementById("default-search").value = ""
    document.getElementById("size").value = ""
    document.getElementById("type").value = ""
    document.getElementById("date").value = ""

    clickFilterButton()
}



async function loadAllEvents() {
    eventBrowsingList = []

    return db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                let dateTime = new Date(doc.data().dateTime);
                let dateEachComponent = getDateList(dateTime)

                if (compareDates(todayEachComponent, dateEachComponent)) {
                    eventBrowsingList.push(doc.id)
                }
                console.log(1)
            }
            ));
}

async function filterResults() {
    let filteredList = [];

    for (let docID of eventBrowsingList) {
        let doc = await db.collection("events").doc(docID).get();

        if (filterEventSearchKeyword != "") {
            let keywords = doc.data().title
                .replaceAll(".", "")
                .replaceAll(",", "")
                .replaceAll("!", "")
                .replaceAll("?", "")
                .replaceAll("(", "")
                .replaceAll(")", "")
                .replaceAll("*", "")
                .replaceAll("&", "")
                .replaceAll("#", "")
                .replaceAll("@", "")
                .toLowerCase()
                .split(" ")

            if (!keywords.includes(filterEventSearchKeyword)) {
                continue;
            }

        }


        if (filterEventSize == "one on one" && doc.data().scale != 1) {
            continue;
        } else if (filterEventSize == "small" && (doc.data().scale < 2 || doc.data().scale > 6)) {
            continue;
        } else if (filterEventSize == "medium" && (doc.data().scale < 7 || doc.data().scale > 12)) {
            continue;
        } else if (filterEventSize == "large" && doc.data().scale < 13) {
            continue;
        }


        if (filterEventType == "in person" && doc.data().scale != "in person") {
            continue;
        } else if (filterEventType == "virtual" && doc.data().scale != "virtual") {
            continue;
        }


        if (filterEventDate != "") {
            dateEachComponent = getDateList(new Date(doc.data().dateTime));
            eventDateTimeEachComponent = getDateList(new Date(`${filterEventDate}, 0:00`))

            if (!(dateEachComponent.year == eventDateTimeEachComponent.year &&
                dateEachComponent.month == eventDateTimeEachComponent.month &&
                dateEachComponent.day == eventDateTimeEachComponent.day)) {
                continue;
            }
        }

        filteredList.push(docID);
    }

    eventBrowsingList = filteredList;
    eventBrowsingListSize = eventBrowsingList.length;
    maxEventPageNumber = Math.ceil(eventBrowsingListSize / 10);
}




function createAndAppendBtn(id, text, className) {
    navbar = document.getElementById("pagination_navbar")

    btn = document.createElement(`button`)
    btn.id = id
    btn.classList = `${className} border-none py-1 px-3 rounded`
    btn.innerHTML = text

    navbar.appendChild(btn)
}

function createPageBtns() {
    let buttonList = []
    let index = currentEventPageNumber
    let maxIndex = index + 4

    if (maxIndex > maxEventPageNumber) {
        maxIndex = maxEventPageNumber
        index = maxEventPageNumber - 4
        if (index <= 0) {
            index = 1
        }
    }

    for (index; index <= maxIndex; index++) {
        buttonList.push({ "id": index, "text": `${index}`, "class": "pageBtn" })
    }



    createAndAppendBtn("prevBtn", "<", "navBtn")
    document.getElementById("prevBtn").addEventListener("click", () => {
        currentEventPageNumber -= 1
        updateNavbarButtons()
        displayResults()
    })

    buttonList.forEach(button => {
        createAndAppendBtn(button.id, button.text, button.class)
        if (document.getElementById(`${button.id}`)) {
            document.getElementById(`${button.id}`).addEventListener("click", () => {
                currentEventPageNumber = parseInt(button.text)
                updateNavbarButtons()
                displayResults()
            }
            )
        }
    })

    createAndAppendBtn("nextBtn", ">", "navBtn")
    document.getElementById("nextBtn").addEventListener("click", () => {
        currentEventPageNumber += 1
        updateNavbarButtons()
        displayResults()
    })
}

function updateNavbarButtons() {
    // Resets the navbar
    document.getElementById("pagination_navbar").innerHTML = ""

    createPageBtns()

    if (document.getElementById(`${currentEventPageNumber}`)) {
        let currentPageBtn = document.getElementById(`${currentEventPageNumber}`)
        currentPageBtn.classList.add("bg-slate-200")
        currentPageBtn.disabled = true;
    }

    if (maxEventPageNumber == 1) {
        btn = document.getElementById("nextBtn")
        btn.classList.add("invisible")
        btn.disabled = true;

        btn = document.getElementById("prevBtn")
        btn.classList.add("invisible")
        btn.disabled = true;
    } else if (currentEventPageNumber == 1) {
        btn = document.getElementById("prevBtn")
        btn.classList.add("invisible")
        btn.disabled = true;
    } else if (currentEventPageNumber == maxEventPageNumber) {
        btn = document.getElementById("nextBtn")
        btn.classList.add("invisible")
        btn.disabled = true;
    }


}



function displayResults() {
    if (eventBrowsingListSize != 0) {
        var cardTemplate = document.getElementById("event_card_template");

        document.getElementById("browsing_list").innerHTML = "";

        let index = (currentEventPageNumber * 10) - 10
        let maxIndex = currentEventPageNumber * 10

        if (maxIndex > eventBrowsingListSize) {
            maxIndex = index + (eventBrowsingListSize % 10)
        }


        for (index; index < maxIndex; index++) {
            eventDocID = eventBrowsingList[index]

            db.collection("events").doc(eventDocID)
                .get()
                .then(doc => {
                    dateTime = new Date(doc.data().dateTime);
                    dateEachComponent = getDateList(dateTime)

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



async function setup() {
    console.log("Start")
    await loadAllEvents()

    console.log(2)
    filterEventSearchKeyword = await document.getElementById("default-search").value.toLowerCase()
    filterEventSize = await document.getElementById("size").value
    filterEventType = await document.getElementById("type").value
    filterEventDate = await document.getElementById("date").value

    await filterResults()
    console.log(4)

    updateNavbarButtons()
    displayResults()
}
setup()