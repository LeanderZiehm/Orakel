// DOM.js handels all the creating and updating of the DOM elements, Nodes and Edges
console.log("DOMGraph.js");

const CREATE_LINES_FOR_CONTEXT_NODES = false;
const NODE_OFFSET_Y = 150;


function createUserNode(text) {
    const referencePosition = getReferencePosition();
    const newNode = getNewNode(text);
    // Note: screen's top-left is (0,0) / i.e. Origin
    const boundingBox = newNode.getBoundingClientRect();
    let nodeX = referencePosition.x - boundingBox.width / 2;
    let nodeY = referencePosition.y - boundingBox.height / 2;
    nodeY += NODE_OFFSET_Y;
    setNodePosition(newNode, nodeX, nodeY);
    newNode.dataset.userNode = "true";
    // join the nodes that are context for the new node

    if (CREATE_LINES_FOR_CONTEXT_NODES) {
        context.forEach((_node) => {
            createLineWithParent(_node, newNode, true);
        });
    }

    addToContext(newNode); // default, new user node is in context
    updateState(newNode); // notify state-machine of new changes
    singleSelect(newNode); // default, select the new node
}

function createLLMNodes(texts) {
    const referencePosition = getReferencePosition();
    const createdNodes = [];
    let combinedLength = 0;
    const PADDING = 0;

    texts.forEach((r) => {
        const newNode = getNewNode(r, true);
        const boundingBox = newNode.getBoundingClientRect();
        combinedLength += boundingBox.width + PADDING;
        createdNodes.push(newNode);
    });

    let startX = referencePosition.x - combinedLength;
    const startY = referencePosition.y + NODE_OFFSET_Y / 2;
    createdNodes.forEach((newNode) => {
        const boundingBox = newNode.getBoundingClientRect();
        startX += boundingBox.width + PADDING;

        setNodePosition(newNode, startX, startY);
    });
}



// event handlers registration



function getNodePositionX(node) {
    const boundingBox = node.getBoundingClientRect();
    return boundingBox.left + boundingBox.width / 2;
}
function getNodePositionY(node) {
    const boundingBox = node.getBoundingClientRect();
    return boundingBox.top + boundingBox.height / 2;
}

function setNodePosition(node, x, y) {
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    if (node.lines) {
        node.lines.forEach((lineContainer) => {
            createLine(lineContainer, node, lineContainer.target);
        });
    }
}


function getNewNode(text, createdByLLM = false) {
    uid += 1; // for state machine and book keeping

    const newNode = document.createElement("div");
    newNode.classList.add("node");
    newNode.textContent = text;
    document.body.appendChild(newNode);
    newNode.dataset.nodeId = uid;

    // calculates new nodes position based on its env

    // if there is an activeNode(s), create a link to that Node
    if (activeNodes[0]) {
        createLineWithParent(activeNodes[0], newNode, false);
    }

    nodes.push(newNode);
    lastCreatedNode = newNode;

    /*
           attaches required events to the new node.
           following events are subscribed:
            - toggling context state when _double clicked_
            - multiselect when _clicked_ **and** holding _shift_
            - drag trigger when _clicked on_ wwithout holding _strl_ or _shift_
          */
    subscribeNodeEvents(newNode);
    return newNode;
}

function reconstructContextList() {
    nodeListContainer.innerHTML = ""; // Clear existing items

    context.forEach((node) => {
        const listItem = document.createElement("li");
        listItem.classList.add("node-list-item");

        const nodeText = document.createElement("span");
        nodeText.classList.add("node-text");
        nodeText.textContent = node.textContent;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("node-delete-btn");
        deleteButton.innerHTML = "&#10006;"; // escape code for `x`
        deleteButton.addEventListener("click", () => removeNodeFromMemory(node));

        listItem.appendChild(nodeText);
        listItem.appendChild(deleteButton);
        nodeListContainer.appendChild(listItem);
    });
}
function removeNodeFromMemory(node) {
    context = context.filter((contextNode) => contextNode !== node);

    node.classList.remove("contexted");
    node.classList.remove("active");

    reconstructContextList();
}
// end node handlers
// context handlers
function toggleContext(node) {
    if (node.classList.contains("contexted")) {
        removeNodeFromMemory(node);
    } else {
        node.classList.add("contexted");
        context.push(node);
    }
    reconstructContextList();
}
function addToContext(node) {
    node.classList.add("contexted");
    context.push(node);
    reconstructContextList();
}
// end context handlers
function getReferencePosition() {
    let pos = { x: 0, y: 0 };
    if (activeNodes[0]) {
        pos.x = getNodePositionX(activeNodes[0]);
        pos.y = getNodePositionY(activeNodes[0]);
        // debug(`activeNodes[0]: pos.x: ${pos.x}, pos.y: ${pos.y}`);
    } else if (lastCreatedNode) {
        pos.x = getNodePositionX(lastCreatedNode);
        pos.y = getNodePositionY(lastCreatedNode);
        debug(`lastCreatedNode: pos.x: ${pos.x}, pos.y: ${pos.y}`);
    } else {
        pos.x = window.innerWidth / 2;
        pos.y = 0;
        //  debug("else" );
    }

    return pos;
}


function createLine(lineContainer, node1, node2) {
    const line = lineContainer.line;

    // prevent line flipping during click event
    // keep the vector direction towards the `targetIsChild`
    if (lineContainer.type == "targetIsParent") {
        node0 = node2;
        node2 = node1;
        node1 = node0;
    }

    const { start, length, slant } = createLineFromAToB(node1, node2);
    line.style.left = `${start.x}px`;
    line.style.top = `${start.y}px`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${slant}deg)`;

    if (lineContainer.type == "targetIsParent") {
        // createArrow(lineContainer)
        // temp: till we find a way to fix arrow head to the box of the Node
    }
}

function createLines(node) {
    // console.log("createLines",node);
    node.lines.forEach((lineContainer) => {
        createLine(lineContainer, node, lineContainer.target);
    });
}

function createLineWithParent(parentNode, childNode, isCreatedByUser = false) {
    const line = document.createElement("div");
    line.classList.add("line");
    document.body.appendChild(line);

    parentNode.lines = parentNode.lines || [];
    childNode.lines = childNode.lines || [];

    parentNode.lines.push({
        line,
        target: childNode,
        type: "targetIsChild",
    });
    childNode.lines.push({
        line,
        target: parentNode,
        type: "targetIsParent",
    });

    createLines(parentNode);
    createLines(childNode);
}

function createArrow(line, base_left, base_top) {
    let circle = line.circle || document.createElement("div");

    circle.style.position = "absolute";
    circle.style.width = "10px";
    circle.style.height = "10px";
    circle.style.borderRadius = "50%";
    circle.style.backgroundColor = "transparent";
    circle.style.zIndex = "100";
    lineContainer.circle = circle;
    circle.style.left = `${base_left}px`;
    circle.style.top = `${base_top}px`;

    document.body.appendChild(circle);
}

function createLineFromAToB(A, B) {
    const APos = A.getBoundingClientRect();
    const BPos = B.getBoundingClientRect();

    // calculate both ends of the edge-line
    const x1 = APos.left + APos.width / 2;
    const y1 = APos.top + APos.height / 2;
    const x2 = BPos.left + BPos.width / 2;
    const y2 = BPos.top + BPos.height / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return { start: { x: x1, y: y1 }, length: distance, slant: angle };
}