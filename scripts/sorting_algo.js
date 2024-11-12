import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
var userUid;

onAuthStateChanged(auth, (user) => {
    if (user) {
        userUid = user.uid;
    } else {
        alert("No user is signed in.");
        window.location.href = "login.html";
    }
});


const barsContainer = document.getElementById('bars-container');
const algorithmSelect = document.getElementById('algorithm-select');
const randomizeButton = document.getElementById('randomize');
const sortButton = document.getElementById('sort');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const speedButton = document.getElementById('speed-button');
const inputButton = document.getElementById('input-button');
const speedDropdown = document.getElementById('speed-dropdown');

let bars = [];
let sorting = false;
let paused = false;
let speed = 1;
let resolvePause = null;

function createBars() {
    barsContainer.innerHTML = '';
    bars = [];

    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        const height = Math.floor(Math.random() * 380) + 20;
        bar.style.height = `${height}px`;
        const valueSpan = document.createElement('span');
        valueSpan.className = 'bar-value';
        valueSpan.textContent = height;
        bar.appendChild(valueSpan);
        bar.draggable = true;
        bar.addEventListener('mousedown', dragStart);
        barsContainer.appendChild(bar);
        bars.push(height);
    }
    updateBarPositions();
}

function renderBars(array) {
    const maxValue = Math.max(...array);
    barsContainer.innerHTML = '';
    bars = [];

    const containerHeight = barsContainer.clientHeight;
    const minHeight = 30;  // Minimum height to avoid bars being too small
    const maxHeight = 380 - minHeight;

    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        //const height = value * 10; // multiply value by 10 to get height in px

        const height = (value / maxValue) * maxHeight + minHeight;

        bar.style.height = `${height}px`;

        const valueSpan = document.createElement('span');
        valueSpan.className = 'bar-value';
        valueSpan.textContent = value; // display the original value
        bar.appendChild(valueSpan);
        bar.draggable = true;
        bar.addEventListener('mousedown', dragStart);
        barsContainer.appendChild(bar);
        bars.push(value);
    });
    updateBarPositions();
}

function updateBarPositions() {
    const containerHeight = 380;
    const maxValue = Math.max(...bars);
    const minHeight = 30;  // Minimum height to avoid bars being too small
    const maxHeight = containerHeight - minHeight;

    const barWidth = (barsContainer.clientWidth - (bars.length + 1) * 5) / bars.length;
    const barElements = barsContainer.children;

    for (let i = 0; i < bars.length; i++) {
        const height = (bars[i] / maxValue) * maxHeight + minHeight;
        barElements[i].style.height = `${height}px`;

        //barElements[i].style.height = `${bars[i]}px`;
        barElements[i].style.left = `${i * (barWidth + 5) + 5}px`;
        barElements[i].style.width = `${barWidth}px`;
        barElements[i].querySelector('.bar-value').textContent = bars[i];

    }
}

function dragStart(e) {
    const draggedBar = e.target;
    let draggedIndex = Array.from(barsContainer.children).indexOf(draggedBar);
    draggedBar.classList.add('dragging');

    const clone = draggedBar.cloneNode(true);
    clone.id = 'draggingClone';
    clone.classList.add('dragging');
    document.body.appendChild(clone);

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', drop);

    function drag(e) {
        if (!draggedBar) return;

        const clone = document.getElementById('draggingClone');
        clone.style.position = 'fixed';
        clone.style.left = `${e.clientX - clone.offsetWidth / 2}px`;
        clone.style.top = `${e.clientY - clone.offsetHeight / 2}px`;

        const containerRect = barsContainer.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const newIndex = Math.floor((x - 5) / (clone.offsetWidth + 5));

        if (newIndex !== draggedIndex && newIndex >= 0 && newIndex < bars.length) {
            const oldPlaceholder = barsContainer.querySelector('.placeholder');
            if (oldPlaceholder) oldPlaceholder.classList.remove('placeholder');

            const barAtNewIndex = barsContainer.children[newIndex];
            barAtNewIndex.classList.add('placeholder');

            const [removed] = bars.splice(draggedIndex, 1);
            bars.splice(newIndex, 0, removed);
            draggedIndex = newIndex;

            updateBarPositions();
        }
    }

    function drop() {
        if (!draggedBar) return;

        const clone = document.getElementById('draggingClone');
        if (clone) document.body.removeChild(clone);

        const placeholder = barsContainer.querySelector('.placeholder');
        if (placeholder) placeholder.classList.remove('placeholder');

        draggedBar.classList.remove('dragging');
        updateBarPositions();

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', drop);
    }

    e.preventDefault();
}

async function swap(i, j) {
    const barElements = barsContainer.children;
    barElements[i].style.backgroundColor = 'blue';
    barElements[j].style.backgroundColor = 'orange';

    let temp = bars[i];
    bars[i] = bars[j];
    bars[j] = temp;
    await updateWithDelay(i, j);

    barElements[i].style.backgroundColor = '';
    barElements[j].style.backgroundColor = '';
}

async function updateWithDelay(...indices) {
    updateBarPositions();
    await new Promise(resolve => setTimeout(resolve, 200 / speed));

    indices.forEach(index => {
        const barElement = barsContainer.children[index];
        // Check if the bar is in its final position
        if (bars.slice(0, index).every((bar, i) => bar <= bars[index])) {
            barElement.style.backgroundColor = 'green';
        } else {
            barElement.style.backgroundColor = '';
        }
    });
}
async function pauseExecution() {
    if (paused) {
        return new Promise(resolve => (resolvePause = resolve));
    }
}

async function bubbleSort() {
    for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            if (paused) await pauseExecution();
            if (bars[j] > bars[j + 1]) {
                await swap(j, j + 1);
            }
        }
        // Turn the last bar green
        const barElement = barsContainer.children[bars.length - i - 1];
        barElement.style.backgroundColor = 'green';
    }
}

async function selectionSort() {
    for (let i = 0; i < bars.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < bars.length; j++) {
            if (paused) await pauseExecution();
            if (bars[j] < bars[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
        // Turn the current bar green
        const barElement = barsContainer.children[i];
        barElement.style.backgroundColor = 'green';
    }
}

async function insertionSort() {
      for (let i = 1; i < bars.length; i++) {
        let j = i;
        while (j > 0 && bars[j - 1] > bars[j]) {
            if (paused) await pauseExecution();
            await swap(j, j - 1);
            j--;
        }
// Turn the current bar green
const barElement = barsContainer.children[j];
barElement.style.backgroundColor = 'green';
}
}
async function quickSort(low = 0, high = bars.length - 1) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = bars[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (paused) await pauseExecution();
        if (bars[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }
    await swap(i + 1, high);
    return i + 1;
}
async function mergeSort(start = 0, end = bars.length - 1) {
    if (start < end) {
        let mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    }
}

async function merge(start, mid, end) {
    let left = bars.slice(start, mid + 1);
    let right = bars.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    while (i < left.length && j < right.length) {
        if (paused) await pauseExecution();
        if (left[i] <= right[j]) {
            bars[k] = left[i];
            i++;
        } else {
            bars[k] = right[j];
            j++;
        }
        await updateWithDelay(k);
        k++;
    }
    while (i < left.length) {
        if (paused) await pauseExecution();
        bars[k] = left[i];
        await updateWithDelay(k);
        i++;
        k++;
    }
    while (j < right.length) {
        if (paused) await pauseExecution();
        bars[k] = right[j];
        await updateWithDelay(k);
        j++;
        k++;
    }
}
async function startSorting() {
    sorting = true;
    sortButton.disabled = true;
    algorithmSelect.disabled = true;

    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';

    const algorithm = algorithmSelect.value;
    switch (algorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'selectionSort':
            await selectionSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'quickSort':
            await quickSort();
            break;
        case 'mergeSort':
            await mergeSort();
            break;
    }

    sorting = false;
    sortButton.disabled = false;
    algorithmSelect.disabled = false;

    playButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';

    // Set all bars to green to indicate sorting is complete
    Array.from(barsContainer.children).forEach(bar => {
        bar.style.backgroundColor = 'green';
    });

    const sortedMessage = document.getElementById('sorted-message');
    sortedMessage.classList.add('show');

    // Hide the message after 1 second
    setTimeout(() => {
        sortedMessage.classList.remove('show');
    }, 2000);
}
randomizeButton.onclick = createBars;
sortButton.onclick = startSorting;

playButton.onclick = () => {
    paused = false;
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    if (resolvePause) {
        resolvePause();
        resolvePause = null;
    }
};

pauseButton.onclick = () => {
    paused = true;
    pauseButton.style.display = 'none';
    playButton.style.display = 'inline-block';
};

speedButton.onclick = () => {
    speedDropdown.classList.toggle('show');
};

speedDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        speed = parseFloat(e.target.getAttribute('data-speed'));
        speedButton.textContent = `Speed: ${speed}x`;
        speedDropdown.classList.remove('show');
    }
});

inputButton.addEventListener('click', async () => {
    const inputData = document.getElementById('array-input').value;
    const unsortedArray = inputData.split(',').map(Number).filter(n => !isNaN(n) && n > 0).slice(0, 100);

    renderBars(unsortedArray);

    await addDoc(collection(db, "sorting"), { 
        element_list: inputData, 
        timestamp: Timestamp.now(),
        uid: userUid });

    fetchUserLists();

});

window.onclick = (event) => {
    if (!event.target.matches('#speed-button')) {
        speedDropdown.classList.remove('show');
    }
};

document.addEventListener('DOMContentLoaded', createBars);

const listsBox = document.getElementById('lists-box');

async function fetchUserLists() {
    const querySnapshot = await getDocs(collection(db, "sorting"));
    listsBox.innerHTML = ''; // Clear previous lists

    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.uid === userUid) { 
            const listButton = document.createElement('button'); 
            listButton.className = 'list-button'; 
            listButton.textContent = data.element_list; 
            listButton.onclick = () => handleListClick(data.element_list); 

            listsBox.appendChild(listButton); 
        }
    });
}


function handleListClick(elementList) {
    const unsortedArray = elementList.split(',').map(Number).filter(n => !isNaN(n) && n > 0).slice(0, 100);

    renderBars(unsortedArray);
}

document.addEventListener('DOMContentLoaded', () => {
    createBars(); 
    fetchUserLists();
});

document.querySelector('.history-dropbtn').addEventListener('click', function () {
    const dropdownContent = document.getElementById('lists-box');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});