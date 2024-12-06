const firebaseConfig = {
  apiKey: "AIzaSyCtS8n-nQFMNCs9pDbs0iO7Aq-OYsSD6cY",
  authDomain: "dtc09-socialscout.firebaseapp.com",
  projectId: "dtc09-socialscout",
  storageBucket: "dtc09-socialscout.firebasestorage.app",
  messagingSenderId: "577690813665",
  appId: "1:577690813665:web:bf0c9c0d2b4f506aef63a0",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
