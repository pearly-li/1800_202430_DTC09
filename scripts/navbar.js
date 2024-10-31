function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); 
            console.log(user.displayName);
            userName = user.displayName;

            document.getElementById("name_goes_here").innerText = userName;

        } else {
            console.log("No user is logged in");
        }
    });
}
getNameFromAuth();

function getPageName() {
    document.getElementById("page_label_goes_here").innerHTML = (document.getElementById("page_label")).innerHTML
}
getPageName();