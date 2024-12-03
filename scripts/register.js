import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { firebaseConfig } from './firebaseConfig.js';

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
            window.location.href = "../pages/login.html"; // Redirect to login
        })
        .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
                alert("An account with this email already exists. Please try logging in or use a different email.");
            } else if (error.code === "auth/weak-password") {
                alert("The password is too weak. Please use a stronger password.");
            } else if (error.code === "auth/invalid-email") {
                alert("The email address is invalid. Please enter a valid email.");
            } else {
                alert("An error occurred. Please ensure all fields are filled, and passwords match.");
            }
        });
    })

VANTA.NET({
    el: "#vanta-bg",
    color: 0xf5f0d9,
    backgroundColor: 0x1a1a1a,
    points: 10.0,
    maxDistance: 20.0,
    spacing: 15.0
});
