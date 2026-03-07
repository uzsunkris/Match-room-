import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { ref, set, push, onValue, serverTimestamp, remove } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const chatBox = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");
const typingIndicator = document.getElementById("typingIndicator");
const stickerPanel = document.getElementById("stickerPanel");
const viewerCount = document.getElementById("viewerCount");
const coinBalance = document.getElementById("coinBalance");

// GET TEAM & MATCH
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("match");
const team = localStorage.getItem("team") || "A";
let coins = 500; // Starting coins
coinBalance.innerText = coins;

// AUTH CHECK
onAuthStateChanged(auth, user => {
  if(!user) window.location.href="login.html";
  else initChat(user);
});

function initChat(user){
  const messagesRef = ref(db, `matches/${matchId}/messages`);
  const typingRef = ref(db, `matches/${matchId}/typing/${user.uid}`);
  const presenceRef = ref(db, `matches/${matchId}/presence/${user.uid}`);

  // Set presence
  set(presenceRef, true);
  onDisconnect(presenceRef).remove();

  // Typing indicator
  messageInput.addEventListener("input", ()=>{
    set(typingRef, {username:user.email, typing:messageInput.value.length>0});
  });
  sendBtn.addEventListener("click", ()=> set(typingRef, null));

  // Listen typing
  const allTypingRef = ref(db, `matches/${matchId}/typing`);
  onValue(allTypingRef, snapshot=>{
    const users = snapshot.val();
    if(users){
      const names = Object.values(users).map(u=>u.username);
      typingIndicator.innerText = names.join(", ") + " is typing...";
    } else typingIndicator.innerText="";
  });

  // Viewer count
  const allPresenceRef = ref(db, `matches/${matchId}/presence`);
  onValue(allPresenceRef, snapshot=>{
    const users = snapshot.val();
    viewerCount.innerText = users ? Object.keys(users).length : 0;
  });

  // Send message
  sendBtn.onclick = async ()=>{
    const text = messageInput.value.trim();
    if(text==="") return;
    push(messagesRef, {text, username:user.email, team, type:"text", time:Date.now()});
    messageInput.value="";
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // Listen messages
  onValue(messagesRef, snapshot=>{
    chatBox.innerHTML="";
    snapshot.forEach(doc=>{
      const msg = doc.val();
      const div = document.createElement("div");
      div.classList.add("message", msg.team==="A"?"teamA":"teamB");
      div.innerHTML = msg.type==="text"?
        `<div class="username">${msg.username}</div><div>${msg.text}</div>`:
        `<div class="username">${msg.username}</div><img src="${msg.url}" style="width:100px;border-radius:8px;">`;
      chatBox.appendChild(div);
      setTimeout(()=>div.classList.add("show"), 50);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // Sticker click
  stickerPanel.addEventListener("click", e=>{
    if(e.target.tagName!=="IMG") return;
    const price = parseInt(e.target.dataset.price);
    if(coins<price){ alert("Not enough coins"); return; }
    coins-=price;
    coinBalance.innerText=coins;
    push(messagesRef, {username:user.email, team, type:"sticker", url:e.target.src, time:Date.now()});
  });

  // Logout
  logoutBtn.onclick = ()=> signOut(auth);
  }
