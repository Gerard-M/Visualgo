// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

VANTA.NET({
    el: "#vanta-bg",
    color: 0xf5f0d9,
    backgroundColor: 0x1a1a1a,
    points: 10.0,
    maxDistance: 20.0,
    spacing: 15.0
});

// Initialize Firebase
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
