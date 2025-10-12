// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA14WiokL9QG10FUFrv5A1Xy_VKhYj40T4",
    authDomain: "casemate-5d9b7.firebaseapp.com",
    projectId: "casemate-5d9b7",
    storageBucket: "casemate-5d9b7.firebasestorage.app",
    messagingSenderId: "719109275757",
    appId: "1:719109275757:web:354851d065fd65bd2abf64",
    measurementId: "G-RHEDZD0XMR"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };