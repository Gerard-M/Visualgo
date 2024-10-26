document.addEventListener('DOMContentLoaded', () => {
    const addNodeButton = document.getElementById('add-node-button');
    const nodeValueInput = document.getElementById('node-value');
    const treeCanvas = document.getElementById('tree-canvas');
    const ctx = treeCanvas.getContext('2d');

    class TreeNode {
        constructor(value, x, y) {
            this.value = value;
            this.x = x;
            this.y = y;
            this.radius = 0; // Start with radius 0 for animation
            this.targetRadius = 20;
            this.left = null;
            this.right = null;
            this.animationProgress = 0; // For animation
        }
    }

    class BinaryTree {
        constructor() {
            this.root = null;
            this.nodes = [];
        }

        addNode(value) {
            const newNode = new TreeNode(value, treeCanvas.width / 2, 50);
            if (this.root === null) {
                this.root = newNode;
                this.nodes.push(newNode);
            } else {
                this.insertNode(this.root, newNode);
            }
            this.animateInsertion(newNode);
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

        async animateInsertion(newNode) {
            // Animate the new node
            newNode.radius = 0; // Start radius at 0
            newNode.animationProgress = 0;
            const animationDuration = 500; // Duration of the animation in ms
            const stepDuration = 20; // Duration of each animation step in ms
            const steps = animationDuration / stepDuration;
            const radiusStep = newNode.targetRadius / steps;

            for (let i = 0; i < steps; i++) {
                await new Promise(resolve => setTimeout(resolve, stepDuration));
                newNode.animationProgress = i / steps;
                newNode.radius = radiusStep * i;
                this.drawTree();
            }
        }

        async drawTree(node = this.root, x = treeCanvas.width / 2, y = 50, level = 0) {
            ctx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

            if (node !== null) {
                const nodeRadius = node.radius || 20; // Use animated radius

                // Draw current node
                ctx.beginPath();
                ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
                ctx.fillStyle = "#3498db"; // Fill color for the circle
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#2980b9"; // Blue outline color
                ctx.stroke(); // Outline the circle

                // Draw node value
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.font = "15px Arial";
                ctx.fillText(node.value, x, y + 5);

                if (node.left !== null) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + nodeRadius);
                    ctx.lineTo(node.left.x, node.left.y); // Line to left child
                    ctx.stroke();
                    await this.drawTree(node.left, node.left.x, node.left.y, level + 1);
                }

                if (node.right !== null) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + nodeRadius);
                    ctx.lineTo(node.right.x, node.right.y); // Line to right child
                    ctx.stroke();
                    await this.drawTree(node.right, node.right.x, node.right.y, level + 1);
                }
            }
        }
    }

    const tree = new BinaryTree();

    addNodeButton.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value) && value !== null) {
            nodeValueInput.value = '';
            tree.addNode(value);
        } else {
            alert("Please enter a valid number.");
        }
    });
});
