import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { firebaseConfig, generateRandomPassphrase } from './firebaseConfig.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentUserEmail = null;
let profileNumber = null;

onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user.uid;
        currentUserEmail = user.email;
        fetchUserData(currentUser);
    } else {
        alert("No user is signed in.");
        window.location.href = 'login.html';
    }
});


async function fetchUserData(uid) {
    const userRef = collection(db, 'users');
    const userSnapshot = await getDocs(userRef);
    let userExists = false;

    userSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.uid === uid) {
            userExists = true; // User found
            
            document.getElementById('profileName').innerText = decryptData(data.name, uid);
            document.getElementById('profileEmail').innerText = data.email;
            document.getElementById('profileAbout').innerText = decryptData(data.about, uid);
            document.getElementById('profileInterests').innerText = decryptData(data.interests, uid);
            profileNumber = "../assets/pic" + data.profilepicture + ".jpg";
            document.getElementById('profilePicture').src = profileNumber;
            
            console.log("User data loaded");
        }
    });

    // If user does not exist, prompt to create a new profile
    if (!userExists) {
        document.getElementById('profileName').innerText = "Name not provided.";
        document.getElementById('profileEmail').innerText = currentUserEmail;
        document.getElementById('profileAbout').innerText = "About data not provided.";
        document.getElementById('profileInterests').innerText = "Interests not provided.";
        document.getElementById('profilePicture').src = "../assets/randompic.jpg";
        console.log("User does not exist. Please fill in your details.");
    }

}

function encryptData(message){
    const passphrase = currentUser;
    const encrypted = CryptoJS.AES.encrypt(message, passphrase).toString();

    return encrypted;
}

function decryptData(encryptedData, passphrase){
    const decrypted = CryptoJS.AES.decrypt(encryptedData, passphrase).toString(CryptoJS.enc.Utf8);

    return decrypted;
}

async function saveUserData() {
    const name = encryptData(document.getElementById('nameInput').value);
    const about = encryptData(document.getElementById('aboutInput').value);
    const interests = encryptData(document.getElementById('interestsInput').value); 

    if (!name) {
        alert("Please fill in all required fields (Name and Email).");
        return; // Exit if the required fields are not filled
    }

    const userDocRef = doc(db, 'users', currentUser);
    const randomNumber = Math.floor(Math.random() * 5) + 1;

    // Save user document
    if (profileNumber == undefined || profileNumber == null){
    await setDoc(userDocRef, {
        uid: currentUser,
        profilepicture: randomNumber,
        name: name,
        about: about,
        interests: interests,
        email: currentUserEmail
        }, { merge: true });
    } else {
        await setDoc(userDocRef, {
            uid: currentUser,
            name: name,
            about: about,
            interests: interests
            }, { merge: true });
    }

    console.log("User data saved");
    location.reload();
}


document.getElementById('saveButton').addEventListener('click', async () => {
    await saveUserData(); // Save the tree state when button is clicked
});


document.getElementById('editButton').addEventListener('click', function() {
    document.getElementById('profileInputs').style.display = 'block';
    document.getElementById('saveButton').style.display = 'inline-block';
    this.style.display = 'none';
});


document.getElementById('saveButton').addEventListener('click', async function() {
    const name = document.getElementById('nameInput').value;
    const about = document.getElementById('aboutInput').value;
    const interests = document.getElementById('interestsInput').value;

    // Hide input fields and show edit button again
    document.getElementById('profileInputs').style.display = 'none';
    this.style.display = 'none'; 
    document.getElementById('editButton').style.display = 'inline-block';
});

async function fetchSortingData() {
    const sortingSnapshot = await getDocs(collection(db, 'sorting'));
    const sortingData = sortingSnapshot.docs.flatMap(doc => {
        const data = doc.data();
        if (data.uid === currentUser) {
            const elementListString = data.element_list;
            return elementListString.split(',').map(Number);
        }
        return [];
    });
    return sortingData;
}

async function fetchTreeData() {
    const treeSnapshot = await getDocs(collection(db, 'TreeHistory'));
    const nodeValues = treeSnapshot.docs.flatMap(doc => {
        const data = doc.data();
        if (data.uid === currentUser) {
            return data.nodeValues;
        }
        return [];
    });
    return nodeValues;
}

async function createCharts() {
    const sortingData = await fetchSortingData();
    const nodeValues = await fetchTreeData();
    
    createSelectionFrequencyChart(sortingData);
    createNodeFrequencyChart(nodeValues);
    createNodeDirectionChart(nodeValues);
}

function createSelectionFrequencyChart(sortingData) {
    const elementFrequency = sortingData.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    const ctx = document.getElementById('selectionFrequencyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(elementFrequency),
            datasets: [{
                label: 'Selection Frequency',
                data: Object.values(elementFrequency),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top-right'
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createNodeFrequencyChart(nodeValues) {
    const nodeFrequency = nodeValues.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    const ctx = document.getElementById('nodeFrequencyChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(nodeFrequency),
            datasets: [{
                label: 'Node Frequency',
                data: Object.values(nodeFrequency),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top-right'
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createNodeDirectionChart(nodeValues) {
    const leftRightCount = { left: 0, right: 0 };

    for (let i = 1; i < nodeValues.length; i++) {
        const current = nodeValues[i];
        const previous = nodeValues[i - 1];

        if (current > previous) {
            leftRightCount.right += 1; // Current is right
        } else if (current < previous) {
            leftRightCount.left += 1; // Current is left
        }
        // If current is equal to previous, you can choose to ignore it
    }

    const ctx = document.getElementById('nodeDirectionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Left Nodes', 'Right Nodes'],
            datasets: [{
                data: [leftRightCount.left, leftRightCount.right],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'top-right'
                }
            },
            responsive: true
        }
    });
}

createCharts();

// Profile photo upload functionality
const editPhotoBtn = document.querySelector('.edit-photo-btn');
const profilePicture = document.getElementById('profilePicture');

// Create a hidden file input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// Handle photo upload button click
editPhotoBtn.addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
    }

    try {
        // Create a preview
        const reader = new FileReader();
        reader.onload = (event) => {
            profilePicture.src = event.target.result;
        };
        reader.readAsDataURL(file);

        // Here you would typically upload the file to your server or storage
        // For now, we'll just update the preview
        // TODO: Add server upload functionality when backend is ready
        
        // Optional: Save the image URL to user's profile in database
        // await updateUserProfilePhoto(imageUrl);
        
    } catch (error) {
        console.error('Error updating profile photo:', error);
        alert('Failed to update profile photo. Please try again.');
    }
});
