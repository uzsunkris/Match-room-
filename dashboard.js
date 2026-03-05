// dashboard.js
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// Elements
const greeting = document.getElementById('greeting');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Greet by displayName (name set during signup) or fallback to email
        greeting.textContent = `Welcome, ${user.displayName || user.email}`;
    } else {
        // Not logged in, redirect to login page
        window.location.href = "index.html";
    }
});

// Logout functionality
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
});
