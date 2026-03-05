// Tabs
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginTab.addEventListener('click', () => {
loginTab.classList.add('active');
signupTab.classList.remove('active');
loginForm.classList.remove('hidden');
signupForm.classList.add('hidden');
});

signupTab.addEventListener('click', () => {
signupTab.classList.add('active');
loginTab.classList.remove('active');
signupForm.classList.remove('hidden');
loginForm.classList.add('hidden');
});

// Form submission placeholders
loginForm.addEventListener('submit', (e) => {
e.preventDefault();
alert("Login submitted! Integrate Firebase here.");
});

signupForm.addEventListener('submit', (e) => {
e.preventDefault();
alert("Signup submitted! Integrate Firebase here.");
});
