import { auth } from './firebase.js';
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// Redirect if not logged in
auth.onAuthStateChanged(user => {
    if(!user){
        window.location.href = "login.html";
    }
});

// Get query parameters (matchId & team)
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("match");
const team = urlParams.get("team");

const matchNameEl = document.getElementById("match-name");
const teamNameEl = document.getElementById("team-name");
const timerEl = document.getElementById("timer");

teamNameEl.textContent = team;

// Firebase Database reference
const db = getDatabase();
const matchRef = ref(db, `matches/${matchId}`);

// Load match data
get(matchRef).then(snapshot => {
    if(snapshot.exists()){
        const match = snapshot.val();
        matchNameEl.textContent = `${match.teamA} vs ${match.teamB}`;

        const startTime = match.startTime;
        const status = match.status;
        const now = Date.now();

        if(status === "live" || now >= startTime){
            // Match is live → go to chat
            window.location.href = `chat.html?match=${matchId}&team=${team}`;
        } else {
            // Match upcoming → show countdown
            const countdown = setInterval(() => {
                const diff = startTime - Date.now();
                if(diff <= 0){
                    clearInterval(countdown);
                    window.location.href = `chat.html?match=${matchId}&team=${team}`;
                } else {
                    const hours = Math.floor(diff / (1000*60*60));
                    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
                    const seconds = Math.floor((diff % (1000*60)) / 1000);
                    timerEl.textContent = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
                }
            }, 1000);
        }

    } else {
        alert("Match not found!");
        window.location.href = "matches.html";
    }
});
