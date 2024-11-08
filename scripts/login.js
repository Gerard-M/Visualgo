import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

let failedAttempts = 0;
let blockUntil = null;

loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("Email:", email);
    console.log("Password:", password);

    // Ensure the email and password are not empty
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Check if the user is blocked
    if (blockUntil && Date.now() < blockUntil) {
        const remainingTime = Math.ceil((blockUntil - Date.now()) / 1000);
        alert(`You are temporarily blocked. Please try again in ${remainingTime} seconds.`);
        return;
    }

    // Reset block and failed attempts if it's past the block time
    if (blockUntil && Date.now() >= blockUntil) {
        blockUntil = null;
        failedAttempts = 0;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User is signed in:", user);
            alert("Login successful!");
            window.location.href = "landing_page.html"; // Redirect to another page after successful login
        })
        .catch((error) => {
            failedAttempts++;
            console.log("Failed attempt:", failedAttempts);

            // If failed attempts reach 3, set a 30-second block
            if (failedAttempts >= 3) {
                blockUntil = Date.now() + 30 * 1000; // Set block time to 30 seconds from now
                alert("Too many failed login attempts. You are blocked for 30 seconds.");
            } else {
                alert("The username or password you entered is incorrect. Please try again.");
            }
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
