const urlParams = new URLSearchParams(window.location.search);

const matchId = urlParams.get("match");

const teamA = document.getElementById("teamA");

const teamB = document.getElementById("teamB");


teamA.addEventListener("click", ()=>{

window.location.href = `chat.html?match=${matchId}&team=A`;

});


teamB.addEventListener("click", ()=>{

window.location.href = `chat.html?match=${matchId}&team=B`;

});
