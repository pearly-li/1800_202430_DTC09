function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); 
            console.log(user.displayName);
            userName = user.displayName;

            document.getElementById("name-goes-here").innerText = userName;

        } else {
            console.log("No user is logged in");
        }
    });
}
getNameFromAuth();