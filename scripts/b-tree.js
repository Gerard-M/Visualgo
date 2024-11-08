import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const addNodeButton = document.getElementById('add-node-button');
    const clearTreeButton = document.getElementById('clear-tree-button');
    const saveTreeButton = document.getElementById('save-tree-button');
    const nodeValueInput = document.getElementById('node-value');
    const treeCanvas = document.getElementById('tree-canvas');
    const ctx = treeCanvas.getContext('2d');
    const historyContainer = document.getElementById('history-container');

    let userId = null;
    let treeModified = false; // Track if the tree has been modified since the last save

    onAuthStateChanged(auth, user => {
        if (user) {
            userId = user.uid;
            loadHistory();
        } else {
            console.log("No user is signed in.");
            window.location.href = 'login.html';
        }
    });

    class TreeNode {
        constructor(value, x, y) {
            this.value = value;
            this.x = x;
            this.y = y;
            this.left = null;
            this.right = null;
        }
    }

    class BinaryTree {
        constructor() {
            this.root = null;
            this.nodes = [];
            this.nodeValues = [];
        }

        addNode(value) {
            const newNode = new TreeNode(value, treeCanvas.width / 2, 50);
            this.nodeValues.push(value);
            if (this.root === null) {
                this.root = newNode;
                this.nodes.push(newNode);
            } else {
                this.insertNode(this.root, newNode);
            }
            treeModified = true; 
            saveTreeButton.disabled = false; // Enable save button when a node is added
        }

        insertNode(node, newNode, depth = 1) {
            if (newNode.value < node.value) {
                if (node.left === null) {
                    newNode.x = node.x - 100 / depth;
                    newNode.y = node.y + 50;
                    node.left = newNode;
                    this.nodes.push(newNode);
                } else {
                    this.insertNode(node.left, newNode, depth + 1);
                }
            } else {
                if (node.right === null) {
                    newNode.x = node.x + 100 / depth;
                    newNode.y = node.y + 50;
                    node.right = newNode;
                    this.nodes.push(newNode);
                } else {
                    this.insertNode(node.right, newNode, depth + 1);
                }
            }
        }

        async saveTreeState() {
            if (!userId) {
                console.error("User not logged in. Cannot save tree state.");
                return;
            }

            await addDoc(collection(db, 'TreeHistory'), {
                uid: userId,
                nodeValues: this.nodeValues,
                timestamp: new Date()
            });

            loadHistory();
            treeModified = false;
            saveTreeButton.disabled = true; // Disable save button after saving
        }

        drawTree() {
            const canvasCenterX = treeCanvas.width / 2;
            const canvasCenterY = treeCanvas.height / 2;
            const canvasDiagonal = Math.hypot(treeCanvas.width, treeCanvas.height);
            const nodeCount = this.nodes.length;
            const radius = Math.max(10, Math.min(30, canvasDiagonal / (2 * Math.sqrt(nodeCount))) / Math.sqrt(nodeCount + 1));

            ctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);
            this.nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = "#2d2d2d";
                ctx.fill();
                ctx.fillStyle = "#efe4d1";
                ctx.textAlign = "center";
                ctx.font = `${radius}px Arial`;
                ctx.fillText(node.value, node.x, node.y + radius / 3);

                if (node.left) {
                    ctx.moveTo(node.x, node.y + radius);
                    ctx.lineTo(node.left.x, node.left.y + radius);
                    ctx.stroke();
                }
                if (node.right) {
                    ctx.moveTo(node.x, node.y + radius);
                    ctx.lineTo(node.right.x, node.right.y + radius);
                    ctx.stroke();
                }
            });
        }

        clear() {
            this.root = null;
            this.nodes = [];
            this.nodeValues = [];
            ctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);
            treeModified = true;
            saveTreeButton.disabled = false; // Enable save button after clearing
        }
    }

    const tree = new BinaryTree();
    
    // Disable save button initially
    saveTreeButton.disabled = true;

    addNodeButton.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            tree.addNode(value);
            animatePop(tree.nodes[tree.nodes.length - 1]);
            nodeValueInput.value = '';
        }
    });

    saveTreeButton.addEventListener('click', async () => {
        await tree.saveTreeState();
    });

    clearTreeButton.addEventListener('click', () => {
        tree.clear();
    });

    function animatePop(node) {
        let startRadius = 0;
        const targetRadius = 20;
        const animationSteps = 10;
        const step = (targetRadius - startRadius) / animationSteps;
        let currentStep = 0;

        function pop() {
            if (currentStep < animationSteps) {
                currentStep++;
                node.radius = startRadius + step * currentStep;
                tree.drawTree();
                requestAnimationFrame(pop);
            }
        }
        pop();
    }

    async function loadHistory() {
        historyContainer.innerHTML = '';
        const q = query(collection(db, 'TreeHistory'), orderBy('timestamp'));
        const querySnapshot = await getDocs(q);
        
        let treeIndex = 1;
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const nodeValues = data.nodeValues;

            if (data.uid === userId) {
                const button = document.createElement('button');
                button.textContent = `Saved Tree ${treeIndex}`;
                button.addEventListener('click', () => loadTreeFromSnapshot(nodeValues));
                historyContainer.appendChild(button);
                treeIndex++;
            }
        });
    }


    function loadTreeFromSnapshot(nodeValues) {
        tree.root = null;
        tree.nodes = [];
        tree.nodeValues = []; // Clear the current nodeValues
    
        // Populate the tree with the node values from the saved snapshot
        nodeValues.forEach(value => {
            tree.addNode(value);
        });
    
        tree.drawTree();
        treeModified = false;
        saveTreeButton.disabled = true; // Disable save button after loading a saved tree
    }
    
});