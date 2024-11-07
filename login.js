import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


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

const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Log the email and password to check their values
    console.log("Email:", email);
    console.log("Password:", password);

    // Ensure the email and password are not empty
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user; 
            console.log("User is signed in:", user); 
            alert("Login successful!");
            window.location.href = "try.html"; 
        })
        .catch((error) => {
            alert("The username or password you entered is incorrect. Please try again.");
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
