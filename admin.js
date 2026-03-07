import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const db = getDatabase();

const form = document.getElementById("add-match-form");
const matchesList = document.getElementById("matches-list");


// ADD MATCH
form.addEventListener("submit", async (e) => {

e.preventDefault();

const teamA = document.getElementById("teamA").value;
const teamB = document.getElementById("teamB").value;
const startTimeInput = document.getElementById("startTime").value;

const startTime = new Date(startTimeInput).getTime();

await push(ref(db,"matches"),{

teamA: teamA,
teamB: teamB,
startTime: startTime,
status: "upcoming"

});

alert("Match Added");

form.reset();

});


// LOAD MATCHES
const matchesRef = ref(db,"matches");

onValue(matchesRef,(snapshot)=>{

matchesList.innerHTML = "";

snapshot.forEach(child=>{

const match = child.val();
const id = child.key;

const div = document.createElement("div");

div.innerHTML = `
<h3>${match.teamA} vs ${match.teamB}</h3>
<p>Start Time: ${new Date(match.startTime).toLocaleString()}</p>
<p>Status: ${match.status}</p>

<button onclick="makeLive('${id}')">Make Live</button>

<button onclick="deleteMatch('${id}')">Delete</button>

<hr>
`;

matchesList.appendChild(div);

});

});


// MAKE MATCH LIVE
window.makeLive = async function(id){

await update(ref(db,"matches/"+id),{

status:"live"

});

alert("Match is now LIVE");

}


// DELETE MATCH
window.deleteMatch = async function(id){

await remove(ref(db,"matches/"+id));

alert("Match Deleted");

  }
