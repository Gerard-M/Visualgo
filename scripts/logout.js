import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

let currentUser, currentUserEmail;

onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user.uid;
        currentUserEmail = user.email;
    } else {
        window.location.href = 'login.html';
    }
});

function logout() {
    signOut(auth).then(() => {
      console.log("User logged out successfully");
      window.location.href = "login.html";  // Redirect to login page or home page
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  }
  
  function goToProfile() {
    document.location.href = "profile.html";  // Redirect to profile page
  }

document.getElementById("logout_btn").addEventListener("click", logout);
document.getElementById("profile_btn").addEventListener("click", goToProfile);