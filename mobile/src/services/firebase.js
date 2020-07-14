import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDR4j0H3oGU_YTPA-4Z8EBaMrs-YoDIWkA',
  authDomain: 'lasid-test01.firebaseapp.com',
  databaseURL: 'https://lasid-test01.firebaseio.com',
  projectId: 'lasid-test01',
  storageBucket: "lasid-test01.appspot.com",
  messagingSenderId: "553935878022",
  appId: "1:553935878022:web:6131eab298b4b290991e07",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };