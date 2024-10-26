document.addEventListener('DOMContentLoaded', () => {
    const barsContainer = document.getElementById('bars-container');
    const sortedDisplay = document.getElementById('sorted-display');
    const startButton = document.getElementById('start-sorting');
    const randomizeButton = document.getElementById('randomize');
    const menuToggle = document.getElementById('menu-toggle');
    const stepContainer = document.getElementById('step-container');
    const nextStepButton = document.getElementById('next-step-btn');
    const playButton = document.getElementById('play-btn');
    const pauseButton = document.getElementById('pause-btn');
    const speedButtons = document.querySelectorAll('.speed-btn');
    const algorithmSelect = document.getElementById('algorithm-select');
    const inputButton = document.getElementById('input-data-button');
    const darkLightThemeButton = document.getElementById('dark-light-theme');
    const stepByStepButton = document.getElementById('step-by-step');
    const sortingSimulationButton = document.getElementById('sorting-simulation');
    const menuSlider = document.getElementById('menu-slider');

    let unsortedArray = [];
    let animationSpeed = 1; // default to normal speed
    let isPaused = false;
    let stepIndex = 0;
    let stepMode = false;
    let sortingInterval = null;

    // Functions for toggling the menu slider
    function toggleMenu() {
        const currentLeft = menuSlider.style.left;
        menuSlider.style.left = currentLeft === '0px' ? '-300px' : '0px';
    }

    // Set speed of sorting animation
    function setSpeed(newSpeed) {
        animationSpeed = newSpeed;
    }

    // Pause sorting
    function pauseSorting() {
        isPaused = true;
    }

    // Play sorting
    function playSorting() {
        isPaused = false;
    }

    // Randomize array for sorting
    function randomizeArray() {
        unsortedArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
        displayArray(unsortedArray);
    }

    // Display array in the bars container
    function displayArray(array) {
        barsContainer.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${value * 3}px`;
            barsContainer.appendChild(bar);
        });
    }

    // Start sorting based on the selected algorithm
    function startSorting() {
        const selectedAlgorithm = algorithmSelect.value;
        switch (selectedAlgorithm) {
            case 'bubbleSort':
                bubbleSort(unsortedArray);
                break;
            case 'selectionSort':
                selectionSort(unsortedArray);
                break;
            case 'insertionSort':
                insertionSort(unsortedArray);
                break;
            case 'quickSort':
                quickSort(unsortedArray, 0, unsortedArray.length - 1);
                break;
        }
    }

    // Step by step sorting logic
    function nextStep() {
        if (stepIndex < unsortedArray.length - 1) {
            bubbleSortStep(unsortedArray, stepIndex);
            stepIndex++;
        } else {
            sortedDisplay.style.display = 'block';
        }
    }

    // Bubble Sort with animation
    async function bubbleSort(array) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (isPaused) return;
                if (array[j] > array[j + 1]) {
                    await swapAndAnimate(array, j, j + 1);
                }
            }
        }
        sortedDisplay.style.display = 'block';
    }

    // Step-by-step bubble sort logic
    function bubbleSortStep(array, stepIndex) {
        for (let j = 0; j < array.length - stepIndex - 1; j++) {
            if (array[j] > array[j + 1]) {
                swapAndAnimate(array, j, j + 1, true); // Step animation
            }
        }
    }

    // Selection Sort
    async function selectionSort(array) {
        for (let i = 0; i < array.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < array.length; j++) {
                if (isPaused) return;
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                await swapAndAnimate(array, i, minIndex);
            }
        }
        sortedDisplay.style.display = 'block';
    }

    // Insertion Sort
    async function insertionSort(array) {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > key) {
                if (isPaused) return;
                array[j + 1] = array[j];
                displayArray(array);
                await sleep(100 / animationSpeed);
                j = j - 1;
            }
            array[j + 1] = key;
            displayArray(array);
            await sleep(100 / animationSpeed);
        }
        sortedDisplay.style.display = 'block';
    }

    // Quick Sort
    async function quickSort(array, low, high) {
        if (low < high) {
            const pivotIndex = await partition(array, low, high);
            await quickSort(array, low, pivotIndex - 1);
            await quickSort(array, pivotIndex + 1, high);
        }
        sortedDisplay.style.display = 'block';
    }

    // Partition logic for quick sort
    async function partition(array, low, high) {
        let pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (isPaused) return;
            if (array[j] < pivot) {
                i++;
                await swapAndAnimate(array, i, j);
            }
        }
        await swapAndAnimate(array, i + 1, high);
        return i + 1;
    }

    // Swap two elements with animation
    async function swapAndAnimate(array, i, j, isStep = false) {
        [array[i], array[j]] = [array[j], array[i]];
        displayArray(array);
        if (!isStep) await sleep(100 / animationSpeed); // normal sorting speed
    }

    // Sleep function for animation delays
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Event Listeners for controls and UI interactions
    menuToggle.addEventListener('click', toggleMenu);
    playButton.addEventListener('click', playSorting);
    pauseButton.addEventListener('click', pauseSorting);
    randomizeButton.addEventListener('click', randomizeArray);
    startButton.addEventListener('click', startSorting);
    speedButtons.forEach(button => {
        button.addEventListener('click', (e) => setSpeed(parseFloat(e.target.getAttribute('data-speed'))));
    });
    stepByStepButton.addEventListener('click', () => {
        stepMode = true;
        stepContainer.style.display = 'block';
        startSorting();
    });
    sortingSimulationButton.addEventListener('click', () => {
        stepMode = false;
        stepContainer.style.display = 'none';
    });
    nextStepButton.addEventListener('click', nextStep);
    darkLightThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    randomizeArray(); // Initial call to display bars
});
