var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;
      if (authResult.additionalUserInfo.isNewUser) {
        db.collection("users")
          .doc(user.uid)
          .set({
            name: user.displayName,
            email: user.email,
            profile_picture: "user.png",
          })
          .then(function () {
            console.log("New user added to firestore");
            window.location.assign("main.html");
          })
          .catch(function (error) {
            console.log("Error adding new user: " + error);
          });
      } else {
        return true;
      }
      return false;
    },
    uiShown: function () {
      document.getElementById("loader").style.display = "none";
    },
  },
  signInFlow: "popup",
  signInSuccessUrl: "main.html",
  signInOptions: [
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  tosUrl: "<your-tos-url>",
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

ui.start("#firebaseui-auth-container", uiConfig);
