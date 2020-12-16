//import * as firebase from 'firebase';
import firebase from "firebase/app"
import "firebase/auth"


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvNfiyvQojW-GzgMf8LsjRFJTm8QlysGs",
    authDomain: "ecommerce-beb82.firebaseapp.com",
    databaseURL: "https://ecommerce-beb82.firebaseio.com",
    projectId: "ecommerce-beb82",
    storageBucket: "ecommerce-beb82.appspot.com",
    messagingSenderId: "74567589698",
    appId: "1:74567589698:web:8bdcefe0c684cd83c3b2db"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //export
  export const auth = firebase.auth();
  //create new instance of firebase
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); 