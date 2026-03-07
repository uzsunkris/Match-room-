// team-select.js
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const matchNameElem = document.getElementById('match-name');
const teamABtn = document.getElementById('team-a-btn');
const teamBBtn = document.getElementById('team-b-btn');

// Protect page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    const matchName = localStorage.getItem('currentMatchName');
    matchNameElem.innerText = matchName || "Unknown Match";
  }
});

// Save team choice and redirect to chat
function chooseTeam(team) {
  const matchId = localStorage.getItem('currentMatchId');
  const userId = auth.currentUser.uid;

  // Save user's team for this match
  set(ref(db, `matches/${matchId}/teams/${userId}`), {
    team: team,
    name: auth.currentUser.displayName || "Anonymous"
  });

  localStorage.setItem('userTeam', team);

  window.location.href = "chat.html";
}

teamABtn.addEventListener('click', () => chooseTeam('A'));
teamBBtn.addEventListener('click', () => chooseTeam('B'));
teamBBtn.addEventListener('click', () => chooseTeam('B'));
teamBBtn.addEventListener('click', () => chooseTeam('B'));
teamABtn.addEventListener('click', () => chooseTeam('A'));
teamBBtn.addEventListener('click', () => chooseTeam('B'));
teamBBtn.addEventListener('click', () => chooseTeam('B'));
teamABtn.addEventListener('click', () => chooseTeam('A'));
teamBBtn.addEventListener('click', () => chooseTeam('B'));
