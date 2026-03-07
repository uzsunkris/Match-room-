import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const db = getDatabase();

const urlParams = new URLSearchParams(window.location.search);

const matchId = urlParams.get("match");

const teamAButton = document.getElementById("teamA");

const teamBButton = document.getElementById("teamB");

const title = document.getElementById("match-title");


// Load match data
async function loadMatch(){

const matchRef = ref(db,"matches/"+matchId);

const snapshot = await get(matchRef);

if(snapshot.exists()){

const match = snapshot.val();

title.innerText = match.teamA + " vs " + match.teamB;

teamAButton.innerText = match.teamA;

teamBButton.innerText = match.teamB;

}

}

loadMatch();


// Team selection
async function chooseTeam(team){

const matchRef = ref(db,"matches/"+matchId);

const snapshot = await get(matchRef);

if(!snapshot.exists()) return;

const match = snapshot.val();

const now = Date.now();

if(match.status === "live" || now >= match.startTime){

window.location.href = `chat.html?match=${matchId}&team=${team}`;

}else{

window.location.href = `waiting.html?match=${matchId}&team=${team}`;

}

}


teamAButton.addEventListener("click",()=>{

chooseTeam("A");

});

teamBButton.addEventListener("click",()=>{

chooseTeam("B");

});
