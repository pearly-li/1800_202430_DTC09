var eventBrowsingList = []
var eventBrowsingListSize = eventBrowsingList.length

var currentEventPageNumber = 1
var maxEventPageNumber = 1

var filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase().split(" ")
var filterEventCategory = document.getElementById("category").value
var filterEventSize = document.getElementById("size").value
var filterEventActivityLevel = document.getElementById("activityLevel").value
var filterEventType = document.getElementById("type").value
var filterEventDate = document.getElementById("date").value

var today = new Date();
var yesterday = new Date()
var tomorrow = new Date()
yesterday.setDate(yesterday.getDate() - 1)
tomorrow.setDate(tomorrow.getDate() + 1)

var todayEachComponent = getDateList(today)
var tomorrowEachComponent = getDateList(tomorrow)
var yesterdayEachComponent = getDateList(yesterday)

let searchBar = document.getElementById("default-search")
searchBar.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        clickFilterButton()
    }
});

let filterSearchBtn = document.getElementById("searchEvent")
filterSearchBtn.addEventListener("click", clickFilterButton)

let removeFilterBtn = document.getElementById("removeFilters")
removeFilterBtn.addEventListener("click", clickRemoveFiltersButton)

let filterDropDownBtn = document.getElementById("filterDropDownBtn")
filterDropDownBtn.addEventListener("click", toggleDropDown)

async function clickFilterButton() {
    document.getElementById("browsing_list").innerHTML = `<p class="mx-auto py-40">Loading...</p>`
    document.getElementById("pagination_navbar").innerHTML = ""
    dropDown = document.getElementById("filterDropDown")
    if (dropDown.classList.contains("flex") == true) {
        toggleDropDown()
    }
    
    currentEventPageNumber = 1

    await loadAllEvents()

    filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase().split(" ")
    filterEventCategory = document.getElementById("category").value
    filterEventSize = document.getElementById("size").value
    filterEventActivityLevel = document.getElementById("activityLevel").value
    filterEventType = document.getElementById("type").value
    filterEventDate = document.getElementById("date").value

    await filterResults()

    updateNavbarButtons()
    displayResults()
}

function clickRemoveFiltersButton() {
    document.getElementById("default-search").value = ""
    document.getElementById("category").value = ""
    document.getElementById("size").value = ""
    document.getElementById("activityLevel").value = ""
    document.getElementById("type").value = ""
    document.getElementById("date").value = ""

    clickFilterButton()
}

function toggleDropDown() {
    console.log(11212)
    dropDown = document.getElementById("filterDropDown")
    dropDown.classList.toggle("hidden");
    dropDown.classList.toggle("flex");
}



async function loadAllEvents() {
    eventBrowsingList = []

    return db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                let dateEachComponent = getDateList(new Date(doc.data().dateTime))

                if (compareIfTodayOrLater(todayEachComponent, dateEachComponent)) {
                    eventBrowsingList.push(doc.id)
                }
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

            matchSearchKeyword = false;
            await filterEventSearchKeyword.forEach(word => {
                if (!keywords.includes(word)) {
                    matchSearchKeyword = true;
                }
            })  

            if (matchSearchKeyword) {
                continue;
            }

        }

        if (filterEventCategory != "" && filterEventCategory != doc.data().category) {
            continue;
        }

        if (filterEventSize == "one on one" && doc.data().maximumParticipants != 1) {
            continue;
        } else if (filterEventSize == "small" && (doc.data().maximumParticipants < 2 || doc.data().maximumParticipants > 6)) {
            continue;
        } else if (filterEventSize == "medium" && (doc.data().maximumParticipants < 7 || doc.data().maximumParticipants > 12)) {
            continue;
        } else if (filterEventSize == "large" && doc.data().maximumParticipants < 13) {
            continue;
        }

        eventLevel = doc.data().activityLevel
        if (filterEventActivityLevel == "low" && eventLevel != 1) {
            continue;
        } else if (filterEventActivityLevel == "low-medium" && (eventLevel < 2 || eventLevel > 3)) {
            continue;
        } else if (filterEventActivityLevel == "medium" && (eventLevel < 4 || eventLevel > 6)) {
            continue;
        } else if (filterEventActivityLevel == "high-medium" && (eventLevel < 7 || eventLevel > 9)) {
            continue;
        } else if (filterEventActivityLevel == "high" && eventLevel < 10) {
            continue;
        }

        if (filterEventType != "" && filterEventType != doc.data().typeOfEvent) {
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

    if (eventBrowsingList.length > 0) {
        createPageBtns()
    
        if (document.getElementById(`${currentEventPageNumber}`)) {
            let currentPageBtn = document.getElementById(`${currentEventPageNumber}`)
            currentPageBtn.classList.add("bg-slate-200")
            currentPageBtn.disabled = true;
        }
    
        if (currentEventPageNumber == 1 && maxEventPageNumber == 1) {
            nextBtn = document.getElementById("nextBtn")
            nextBtn.classList.add("invisible")
            nextBtn.disabled = true;
    
            prevBtn = document.getElementById("prevBtn")
            prevBtn.classList.add("invisible")
            prevBtn.disabled = true;
        } else if (currentEventPageNumber == 1) {
            prevBtn = document.getElementById("prevBtn")
            prevBtn.classList.add("invisible")
            prevBtn.disabled = true;
        } else if (currentEventPageNumber == maxEventPageNumber) {
            nextBtn = document.getElementById("nextBtn")
            nextBtn.classList.add("invisible")
            nextBtn.disabled = true;
        }
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
                    dateEachComponent = getDateList(new Date(doc.data().dateTime))

                    dateDisplay = checkIfTodayOrTomorrowOrYesterday(todayEachComponent, tomorrowEachComponent, yesterdayEachComponent, dateEachComponent);
                    title = doc.data().title;
                    image = doc.data().image
                    docID = doc.id;
                    newCard = cardTemplate.content.cloneNode(true);

                    newCard.querySelector(".event_card_title").innerHTML = title;
                    newCard.querySelector(".event_card_date").innerHTML = dateDisplay;
                    newCard.querySelector(".event_card_time").innerHTML = formatTimeAgo(dateDisplay, todayEachComponent, dateEachComponent);
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
    await loadAllEvents()

    console.log("eventBrowsingList")
    console.log(eventBrowsingList)

    filterEventSearchKeyword = document.getElementById("default-search").value.toLowerCase().split(" ")
    filterEventCategory = document.getElementById("category").value
    filterEventSize = document.getElementById("size").value
    filterEventActivityLevel = document.getElementById("activityLevel").value
    filterEventType = document.getElementById("type").value
    filterEventDate = document.getElementById("date").value

    await filterResults()
    console.log(currentEventPageNumber)
    console.log(maxEventPageNumber)
    console.log(eventBrowsingList)

    updateNavbarButtons()
    displayResults()
}
setup()