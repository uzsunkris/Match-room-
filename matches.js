// matches.js
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// Sample match list (could also come from Realtime Database)
const matches = [
  { id: 'match1', name: 'Arsenal vs Liverpool' },
  { id: 'match2', name: 'Barcelona vs Real Madrid' },
  { id: 'match3', name: 'Manchester City vs Chelsea' }
];

const matchesGrid = document.getElementById('matches-grid');
const logoutBtn = document.getElementById('logout-btn');

// Logout button
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// Protect page: redirect if not signed in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadMatches();
  }
});

// Load matches dynamically
function loadMatches() {
  matchesGrid.innerHTML = "";
  matches.forEach(match => {
    const card = document.createElement('div');
    card.classList.add('match-card');
    card.innerHTML = `
      <h3>${match.name}</h3>
      <button onclick="selectMatch('${match.id}', '${match.name}')">Enter Room</button>
    `;
    matchesGrid.appendChild(card);
  });
}

// When a match is clicked, store match ID and redirect to team selection
window.selectMatch = (matchId, matchName) => {
  localStorage.setItem('currentMatchId', matchId);
  localStorage.setItem('currentMatchName', matchName);
  window.location.href = "team-select.html";
}
