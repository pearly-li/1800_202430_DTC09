let map, infoWindow, geocoder;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.292464046735944, lng: - 123.14540259572419 },
        zoom: 15,
    });

    infoWindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();

    const locationButton = document.createElement("button");
    locationButton.textContent = "Use Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                    map.setZoom(15);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
    displayEventLocation();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function displayEventLocation() {
    const eventID = localStorage.getItem("eventId");

    if (!eventID) {
        alert("No event selected. Please go back and select an event.");
        return;
    }

    db.collection("events")
        .doc(eventID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const eventLocation = doc.data().location;

                geocoder.geocode({ address: eventLocation }, (results, status) => {

                    if (status === "OK") {

                        map.setCenter(results[0].geometry.location);

                        new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: doc.data().title,
                        });

                        infoWindow.setContent(`<h3>${doc.data().title}</h3><p>${eventLocation}</p>}`);
                        infoWindow.open(map);
                    } else {
                        console.error("Geocode was not successful for the following reason: " + status);
                        alert("Could not find the event location on the map.");
                    }
                });
            } else {
                alert("Event not found.");
            }
        })
        .catch((error) => {
            console.error("Error retrieving event data: ", error);
        });
}

window.initMap = initMap;
