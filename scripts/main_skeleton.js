function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log($("#headerPlaceholder").load("./text/main_nav.html"));
      console.log(
        $("#footerPlaceholder").load("./text/footer_after_login.html")
      );
      console.log(
        $("#event_card_template").load("./text/event_card_template.html")
      );
    } else {
      console.log($("#headerPlaceholder").load("./text/nav_before_login.html"));
      console.log(
        $("#footerPlaceholder").load("./text/footer_before_login.html")
      );
    }
  });
}
loadSkeleton();
