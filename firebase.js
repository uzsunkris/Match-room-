// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXzeF1LsdQxg9RcZ3KyMzWimBXKwBAyaw",
    authDomain: "match-room-a469b.firebaseapp.com",
    projectId: "match-room-a469b",
    storageBucket: "match-room-a469b.firebasestorage.app",
    messagingSenderId: "621908983860",
    appId: "1:621908983860:web:bb5b683d1322683ee34a61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export auth for use in auth.js


