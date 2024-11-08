function searchEvent() {
    // Reference to the Firestore collection
    var searchHistory = db.collection("search");

    // Check if a user is signed in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Get input values
            const searchValue = document.getElementById("search").value;
            const sizeValue = document.getElementById("size").value;
            const typeValue = document.getElementById("type").value;
            const dateValue = document.getElementById("date").value;

            // Add a new document to the Firestore collection
            searchHistory.add({
                host: user.uid,
                search: searchValue,
                size: sizeValue,
                type: typeValue,
                date: dateValue,
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            }).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                alert("Search saved successfully!");
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        } else {
            console.log("Error: No user signed in");
        }
    });
}

const searchButton = document.getElementById("searchEvent");
searchButton.addEventListener("click", searchEvent);
