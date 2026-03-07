import { auth } from "./firebase.js";

import { getDatabase, ref, push, onChildAdded, get, update } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const db = getDatabase();

const chatContainer = document.getElementById("chat-container");

const input = document.getElementById("message-input");

const sendBtn = document.getElementById("send-btn");

const stickerPanel = document.getElementById("sticker-panel");

const toggleStickers = document.getElementById("toggle-stickers");

const coinBalance = document.getElementById("coin-balance");

const urlParams = new URLSearchParams(window.location.search);

const matchId = urlParams.get("match");

const team = urlParams.get("team");


let coins = 0;


// Protect page

auth.onAuthStateChanged(async user => {

if(!user){

window.location.href = "index.html";

return;

}

const userRef = ref(db,"users/"+user.uid);

const snap = await get(userRef);

if(snap.exists()){

coins = snap.val().coins || 500;

coinBalance.textContent = coins;

}

loadMessages();

});



// Load messages

function loadMessages(){

const msgRef = ref(db,"matches/"+matchId+"/messages");

onChildAdded(msgRef,snapshot=>{

const msg = snapshot.val();

displayMessage(msg);

});

}



// Display message

function displayMessage(msg){

const div = document.createElement("div");

div.classList.add("message");

if(msg.team==="A"){

div.classList.add("teamA");

}else{

div.classList.add("teamB");

}


if(msg.type==="text"){

div.innerText = msg.username+": "+msg.text;

}


if(msg.type==="sticker"){

const img = document.createElement("img");

img.src = msg.url;

img.classList.add("sticker-msg");

div.appendChild(img);

}

chatContainer.appendChild(div);

chatContainer.scrollTop = chatContainer.scrollHeight;

}



// Send text message

sendBtn.addEventListener("click",()=>{

const text = input.value.trim();

if(text==="") return;

const msgRef = ref(db,"matches/"+matchId+"/messages");

push(msgRef,{

username: auth.currentUser.email,

text:text,

team:team,

type:"text",

time:Date.now()

});

input.value="";

});



// Toggle sticker panel

toggleStickers.addEventListener("click",()=>{

stickerPanel.classList.toggle("show");

});



// Send sticker

stickerPanel.addEventListener("click",async e=>{

if(e.target.tagName!=="IMG") return;

const price = parseInt(e.target.dataset.price);

if(coins<price){

alert("Not enough coins");

return;

}

coins -= price;

coinBalance.textContent = coins;

await update(ref(db,"users/"+auth.currentUser.uid),{

coins:coins

});

const msgRef = ref(db,"matches/"+matchId+"/messages");

push(msgRef,{

username:auth.currentUser.email,

url:e.target.src,

team:team,

type:"sticker",

time:Date.now()

});

});
