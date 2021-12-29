// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBPNbd_7hLOsODqyu9mNr8YIaMgSih3znM",
    authDomain: "mdm-staff.firebaseapp.com",
    projectId: "mdm-staff",
    storageBucket: "mdm-staff.appspot.com",
    messagingSenderId: "271877507579",
    appId: "1:271877507579:web:96f5a11c79c3101e3ba35e",
    measurementId: "G-2Q2EW9LD0E"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore()
