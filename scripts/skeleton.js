function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log($('#navbarPlaceholder').load('./text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer_after_login.html'));
        } else {
            console.log($('#navbarPlaceholder').load('./text/nav_before_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer_before_login.html'));
        }
    });
}
loadSkeleton();