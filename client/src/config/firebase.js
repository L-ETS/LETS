// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDASCt_jedwSzgsAP6sDMt2qFke7OkueE",
  authDomain: "react-project-lets.firebaseapp.com",
  projectId: "react-project-lets",
  storageBucket: "react-project-lets.appspot.com",
  messagingSenderId: "864923834839",
  appId: "1:864923834839:web:0fe83a219aa4137e6a1392"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//console.log(db)

export {db};