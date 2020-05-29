import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDR4j0H3oGU_YTPA-4Z8EBaMrs-YoDIWkA",
    authDomain: "lasid-test01.firebaseapp.com",
    databaseURL: "https://lasid-test01.firebaseio.com",
    projectId: "lasid-test01",
    storageBucket: "lasid-test01.appspot.com",
    messagingSenderId: "553935878022",
    appId: "1:553935878022:web:6131eab298b4b290991e07",
    measurementId: "G-5953BYJV47"
};

firebase.initializeApp(firebaseConfig);

export default firebase;