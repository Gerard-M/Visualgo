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
        alert("No user is signed in.");
        window.location.href = 'login.html';
    }
});

   window.onload = function() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100vw';
        loadingScreen.style.height = '100vh';
        loadingScreen.style.background = 'black';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.fontSize = '100px';
        document.body.appendChild(loadingScreen);
    
        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 3s';
            loadingScreen.style.opacity = 0;
            setTimeout(() => {
                document.body.style.transition = 'opacity 3s';
                document.body.style.opacity = 1;
                loadingScreen.remove();
            }, 2000);
        }, 1000);
    };

function addToStack() {
            const stackInput = document.getElementById("stack-input").value;
            const stackError = document.getElementById("stack-error");
            stackError.textContent = "";

            if (stackInput === "") {
                stackError.textContent = "Please enter a value.";
                return;
            }

            const stackItems = document.getElementById("stack-items");
            const newItem = document.createElement("div");
            newItem.classList.add("item", "item-added");
            newItem.textContent = stackInput;
            
            // Prepend the item to display it at the top
            stackItems.prepend(newItem);

            document.getElementById("stack-input").value = "";

            setTimeout(() => {
                newItem.classList.remove("item-added");
            }, 300);
        }

        function popFromStack() {
            const stackItems = document.getElementById("stack-items");
            const stackError = document.getElementById("stack-error");

            if (!stackItems.firstElementChild) {
                stackError.textContent = "Stack is empty!";
                return;
            }

            const firstItem = stackItems.firstElementChild;
            firstItem.classList.add("item-removed");
            setTimeout(() => {
                stackItems.removeChild(firstItem);
            }, 300);
        }

        function addToQueue() {
            const queueInput = document.getElementById("queue-input").value;
            const queueError = document.getElementById("queue-error");
            queueError.textContent = "";

            if (queueInput === "") {
                queueError.textContent = "Please enter a value.";
                return;
            }

            const queueItems = document.getElementById("queue-items");
            const newItem = document.createElement("div");
            newItem.classList.add("item", "item-added");
            newItem.textContent = queueInput;
            queueItems.appendChild(newItem);

            document.getElementById("queue-input").value = "";

            setTimeout(() => {
                newItem.classList.remove("item-added");
            }, 300);
        }

        function dequeue() {
            const queueItems = document.getElementById("queue-items");
            const queueError = document.getElementById("queue-error");

            if (!queueItems.firstElementChild) {
                queueError.textContent = "Queue is empty!";
                return;
            }

            const firstItem = queueItems.firstElementChild;
            firstItem.classList.add("item-removed");
            setTimeout(() => {
                queueItems.removeChild(firstItem);
            }, 300);
        }

        document.getElementById("pushButton").onclick = addToStack;
        document.getElementById("popButton").onclick = popFromStack;
        document.getElementById("enqueueButton").onclick = addToQueue;
        document.getElementById("dequeueButton").onclick = dequeue;
