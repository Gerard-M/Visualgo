import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { firebaseConfig } from './firebaseConfig.js';

VANTA.NET({
    el: "#vanta-bg",
    color: 0xf5f0d9,
    backgroundColor: 0x1a1a1a,
    points: 10.0,
    maxDistance: 20.0,
    spacing: 15.0
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get references to the input and button
const emailInput = document.getElementById("email");
const resetPasswordBtn = document.getElementById("reset-password-btn");

// Add event listener to the reset button
resetPasswordBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    // Send password reset email
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Please check your inbox.");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});
