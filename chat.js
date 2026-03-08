import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { ref, set, push, onValue, serverTimestamp, remove, onDisconnect } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// DOM elements
const chatBox = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");
const typingIndicator = document.getElementById("typingIndicator");
const stickerPanel = document.getElementById("stickerPanel");
const viewerCount = document.getElementById("viewerCount");
const coinBalance = document.getElementById("coinBalance");

// Get team and match ID
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("match");
const team = localStorage.getItem("team") || "A";

let coins = 500;
coinBalance.innerText = coins;

// AUTH CHECK
onAuthStateChanged(auth, user => {
  if(!user) window.location.href = "login.html";
  else initChat(user);
});

function initChat(user){
  const messagesRef = ref(db, `matches/${matchId}/messages`);
  const typingRef = ref(db, `matches/${matchId}/typing/${user.uid}`);
  const presenceRef = ref(db, `matches/${matchId}/presence/${user.uid}`);

  // Set presence
  set(presenceRef, true);
  onDisconnect(presenceRef).remove();

  // TYPING INDICATOR
  messageInput.addEventListener("input", () => {
    set(typingRef, { username: user.email, typing: messageInput.value.length > 0 });
  });

  const allTypingRef = ref(db, `matches/${matchId}/typing`);
  onValue(allTypingRef, snapshot => {
    const users = snapshot.val();
    if(users){
      const names = Object.values(users).map(u => u.username);
      typingIndicator.innerText = names.join(", ") + " is typing...";
    } else typingIndicator.innerText = "";
  });

  // VIEWER COUNT
  const allPresenceRef = ref(db, `matches/${matchId}/presence`);
  onValue(allPresenceRef, snapshot => {
    const users = snapshot.val();
    viewerCount.innerText = users ? Object.keys(users).length : 0;
  });

  // SEND MESSAGE
  sendBtn.addEventListener("click", () => {

    set(typingRef, null);

    const text = messageInput.value.trim();
    if(text === "") return;

    const newMsgRef = push(messagesRef);
    set(newMsgRef, {
      text: text,
      username: user.email,
      team: team,
      type: "text",
      time: Date.now()
    });

    messageInput.value = "";
  });

  // LISTEN FOR MESSAGES IN REAL TIME
  onValue(messagesRef, snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.val();
      const div = document.createElement("div");
      div.classList.add("message", msg.team === "A" ? "teamA" : "teamB");

      if(msg.type === "text"){
        div.innerHTML = `<div class="username">${msg.username}</div><div>${msg.text}</div>`;
      } else if(msg.type === "sticker"){
        div.innerHTML = `<div class="username">${msg.username}</div><img src="${msg.url}" style="width:100px;border-radius:8px;">`;
      }

      chatBox.appendChild(div);
      setTimeout(() => div.classList.add("show"), 50);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // STICKER CLICK
  stickerPanel.addEventListener("click", e => {
    if(e.target.tagName !== "IMG") return;
    const price = parseInt(e.target.dataset.price);
    if(coins < price){ alert("Not enough coins"); return; }
    coins -= price;
    coinBalance.innerText = coins;

    const newMsgRef = push(messagesRef);
    set(newMsgRef, {
      username: user.email,
      team: team,
      type: "sticker",
      url: e.target.src,
      time: Date.now()
    });
  });

  // LOGOUT
  logoutBtn.onclick = () => signOut(auth);
}
