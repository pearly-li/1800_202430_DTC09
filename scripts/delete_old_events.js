var today = new Date();
var yesterday = today
yesterday.setDate(yesterday.getDate() - 1)

var todayEachComponent = getDateList(today)
var yesterdayEachComponent = getDateList(yesterday)

oldEventsList = []

async function loadAllOldEvents() {
    return db.collection("events")
        .orderBy("dateTime")
        .get()
        .then(allEvents =>
            allEvents.forEach(doc => {
                let dateEachComponent = getDateList(new Date(doc.data().dateTime))

                if (compareIfYesterdayOrOlder(yesterdayEachComponent, dateEachComponent)) {
                    oldEventsList.push(doc.id)
                }
            })
        );
}

async function deleteOldEvents() {
    var hostID
    var participants

    if (oldEventsList.length > 0) {
        oldEventsList.forEach(docID => {
            console.log(1)
            db.collection("events").doc(docID)
                .get()
                .then(doc => {
                    console.log(2)
                    hostID = doc.data().host
                    db.collection("users").doc(hostID)
                        .update({
                            myposts: firebase.firestore.FieldValue.arrayRemove(docID)
                        })

                    console.log(3)

                    participants = doc.data().participants
                    participants.forEach(eachPerson => {
                        db.collection("users").doc(eachPerson)
                            .update({
                                eventAttend: firebase.firestore.FieldValue.arrayRemove(docID)
                            })

                        console.log(4)

                    })
                    db.collection("users")
                        .where("likePosts", "array-contains", docID)
                        .get()
                        .then((info) => {
                            if (info.empty) {
                                console.log("There is no one who clicked a like button for the event")
                            } else {
                                info.forEach((doc) => {
                                    db.collection("users").doc(doc.id)
                                        .update({
                                            likePosts: firebase.firestore.FieldValue.arrayRemove(docID)
                                        })
                                })
                            }
                        })
                    db.collection("events").doc(docID)
                        .delete()
                })
        })
    }
}


async function setup() {
    await loadAllOldEvents()

    console.log(oldEventsList)
    await deleteOldEvents()
}
setup()