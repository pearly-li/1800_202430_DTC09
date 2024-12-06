let map, infoWindow, geocoder, directionsService, directionsRenderer;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.292464046735944, lng: -123.14540259572419 },
        zoom: 15,
        mapTypeControl: false,
    });

    infoWindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const locationButton = document.createElement("button");
    locationButton.textContent = "View Directions";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    viewDirections(userLocation);
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
                const eventLocation = doc.data().streetNumber + " " + doc.data().streetName + " " + doc.data().city;
                console.log("Event Location: " + eventLocation);

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

function viewDirections(userLocation) {
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
                const eventLocation = doc.data().streetNumber + " " + doc.data().streetName + " " + doc.data().city;

                geocoder.geocode({ address: eventLocation }, (results, status) => {
                    if (status === "OK") {
                        const destination = results[0].geometry.location;

                        const request = {
                            origin: userLocation,
                            destination: destination,
                            travelMode: google.maps.TravelMode.DRIVING, // Can be DRIVING, WALKING, TRANSIT, or BICYCLING
                        };

                        directionsService.route(request, (result, status) => {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsRenderer.setDirections(result);
                            } else {
                                console.error("Directions request failed due to " + status);
                                alert("Unable to get directions to the event location.");
                            }
                        });
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

document.getElementById("openGoogleMaps").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                openGoogleMapsDirections(userLocation);
            },
            () => {
                alert("Unable to access your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

function openGoogleMapsDirections(userLocation) {
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
                const eventLocation = doc.data().streetNumber + " " + doc.data().streetName + " " + doc.data().city;

                geocoder.geocode({ address: eventLocation }, (results, status) => {
                    if (status === "OK") {
                        const destination = results[0].geometry.location;

                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat()},${destination.lng()}&travelmode=driving`;

                        window.open(googleMapsUrl, "_blank");
                    } else {
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

