import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const chatBox = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");


// GET TEAM
const team = localStorage.getItem("team") || "A";


// AUTH CHECK
onAuthStateChanged(auth,(user)=>{

if(!user){

window.location.href="index.html";

}else{

loadMessages(user);

}

});


// SEND MESSAGE
sendBtn.onclick = async ()=>{

const text = messageInput.value.trim();

if(text==="") return;

await addDoc(collection(db,"messages"),{

text:text,
username:auth.currentUser.email,
team:team,
createdAt:serverTimestamp()

});

messageInput.value="";

};



// LOAD MESSAGES REALTIME
function loadMessages(user){

const q = query(collection(db,"messages"),orderBy("createdAt"));

onSnapshot(q,(snapshot)=>{

chatBox.innerHTML="";

snapshot.forEach((doc)=>{

const msg = doc.data();

const div = document.createElement("div");

div.classList.add("message");

if(msg.team==="A"){
div.classList.add("teamA");
}else{
div.classList.add("teamB");
}

div.innerHTML=`

<div class="username">${msg.username}</div>
<div>${msg.text}</div>

`;

chatBox.appendChild(div);

});

chatBox.scrollTop = chatBox.scrollHeight;

});

}



// LOGOUT
logoutBtn.onclick = ()=>{

signOut(auth);

};
