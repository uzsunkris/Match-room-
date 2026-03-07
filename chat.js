import { auth } from './firebase.js';
import { getDatabase, ref, push, onChildAdded, get, child, set, update } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// Ensure user is logged in
auth.onAuthStateChanged(async user => {
    if(!user){
        window.location.href = "login.html";
        return;
    }
    initChat(user.uid);
});

const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("match");
const team = urlParams.get("team");

const chatContainer = document.getElementById("chat-container");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const stickerPanel = document.getElementById("sticker-panel");
const stickerToggle = document.getElementById("sticker-toggle");
const coinDisplay = document.getElementById("coin-balance");
const matchNameEl = document.getElementById("match-name");

const db = getDatabase();
let userCoins = 0;

async function initChat(uid){
    // Load user coins
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if(snapshot.exists()){
        userCoins = snapshot.val().coins || 500; // default coins
        coinDisplay.textContent = userCoins;
    }

    // Load match info
    const matchRef = ref(db, `matches/${matchId}`);
    const matchSnap = await get(matchRef);
    if(matchSnap.exists()){
        const match = matchSnap.val();
        matchNameEl.textContent = `${match.teamA} vs ${match.teamB}`;
    }

    // Listen for new messages
    const messagesRef = ref(db, `matches/${matchId}/messages`);
    onChildAdded(messagesRef, snapshot => {
        const msg = snapshot.val();
        displayMessage(msg);
    });
}

// Display message
function displayMessage(msg){
    const div = document.createElement("div");
    div.classList.add("chat-message");
    div.classList.add(msg.team === "A" ? "teamA" : "teamB");

    if(msg.type === "text"){
        div.textContent = msg.username + ": " + msg.text;
    } else if(msg.type === "sticker"){
        const img = document.createElement("img");
        img.src = msg.url;
        img.classList.add("chat-sticker");
        div.appendChild(document.createTextNode(msg.username + ": "));
        div.appendChild(img);
    }

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send text message
sendBtn.addEventListener("click", async () => {
    const text = messageInput.value.trim();
    if(text === "") return;
    const user = auth.currentUser;
    const msgRef = ref(db, `matches/${matchId}/messages`);
    await push(msgRef, {
        username: user.email,
        text: text,
        team: team,
        type: "text",
        timestamp: Date.now()
    });
    messageInput.value = "";
});

// Sticker toggle
stickerToggle.addEventListener("click", () => {
    stickerPanel.classList.toggle("hidden");
});

// Sending sticker
stickerPanel.addEventListener("click", async e => {
    if(e.target.tagName !== "IMG") return;
    const stickerCoin = parseInt(e.target.dataset.coin);
    if(userCoins < stickerCoin){
        alert("Not enough coins!");
        return;
    }
    // Deduct coins
    userCoins -= stickerCoin;
    coinDisplay.textContent = userCoins;
    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    await update(userRef, { coins: userCoins });

    // Send sticker message
    const msgRef = ref(db, `matches/${matchId}/messages`);
    await push(msgRef, {
        username: auth.currentUser.email,
        url: e.target.src,
        team: team,
        type: "sticker",
        timestamp: Date.now()
    });
});
