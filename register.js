import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBz8LZdMnNWhufMeIb7Hw7ie91zYcnRAyk",
    authDomain: "visualgo-cs3101.firebaseapp.com",
    projectId: "visualgo-cs3101",
    storageBucket: "visualgo-cs3101.appspot.com",
    messagingSenderId: "306021898977",
    appId: "1:306021898977:web:6a88d1283f0d59cc5975a0",
    measurementId: "G-8YZQWPJQGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const createAcctBtn = document.getElementById("create-acct-btn");
const emailInput = document.getElementById("email-signup");
const confirmEmailInput = document.getElementById("confirm-email-signup");
const passwordInput = document.getElementById("password-signup");
const confirmPasswordInput = document.getElementById("confirm-password-signup");

createAcctBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const confirmEmail = confirmEmailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (email !== confirmEmail) {
        alert("Email addresses do not match.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Account created successfully!");
            window.location.href = "login.html"; // Redirect to login
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

VANTA.NET({
    el: "#vanta-bg",
    color: 0xf5f0d9,
    backgroundColor: 0x1a1a1a,
    points: 10.0,
    maxDistance: 20.0,
    spacing: 15.0
});