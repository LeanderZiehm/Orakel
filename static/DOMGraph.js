// DOM.js handels all the creating and updating of the DOM elements, Nodes and Edges
console.log("DOMGraph.js");

/**@typedef {{x:number; y:number;}} Position   */
/**@typedef {"targetIsChild"|"targetIsParent"} OrakelNodeTarget */
/**@typedef {{line: HTMLDivElement; target: HTMLDivElement; type: OrakelNodeTarget}} OrakelLine */
/**@typedef {HTMLDivElement & {lines: Array<OrakelLine>;}} OrakelNode */
/**@typedef {{start: Position; length: number; slant: number;}} OrakelLineMeta */

/**@type {boolean} */
const CREATE_LINES_FOR_CONTEXT_NODES = false;

/**@type {number} */
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

  newNode.dataset.userNode = "true"; // indicate the owner

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

/**
 * @function createLLMNodes
 * @param {string} texts text that needs to be made as node's content
 */
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

/**
 * @summary computes the position of a node in x coordinate if
 * top-left of the screen is (0,0) [origin]
 * @param {OrakelNode} node inquiring node's position
 * @returns {Position}
 */
function getNodePosition(node) {
  const boundingBox = node.getBoundingClientRect();
  return {
    x: boundingBox.left + boundingBox.width / 2,
    y: boundingBox.top + boundingBox.height / 2,
  };
}

/**
 * @summary sets the `node` position and updates the lines attached
 * @param {OrakelNode} node node whose position needs to be set
 * @param {number} x x position if top-left corner is (0,0)
 * @param {number} y y position if top-left corner is (0,0)
 */
function setNodePosition(node, x, y) {
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;

  if (node.lines) {
    node.lines.forEach((lineContainer) => {
      createLine(lineContainer, node, lineContainer.target);
    });
  }
}

/**
 * @summary creates a div node with included text content and proper
 * styling depending on who created the node
 * @param {string} text new node's text content
 * @param {boolean} createdByLLM flag to indicate who created the node
 * @returns {OrakelNode}
 *
 * @todo write test
 * @todo refactor param createByLLM
 */
function getNewNode(text, createdByLLM = false) {
  /**@global */
  uid += 1; // for state machine and book keeping

  const newNode = document.createElement("div");
  newNode.textContent = text; // text content
  newNode.classList.add("node"); // proper styling
  newNode.dataset.nodeId = uid.toString(); // state machine uid

  document.body.appendChild(newNode);

  // if there is an activeNode(s), create a link to that Node
  if (activeNodes[0]) {
    createLineWithParent(activeNodes[0], newNode, false);
  }

  nodes.push(newNode);
  lastCreatedNode = newNode;

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

/**
 * @summary computes starting coordinates of next new node
 * using either active Nodes or last creation node. consider
 * top-left corner of the screen as (0,0) [origin] for the plane
 * @returns {Position}
 */
function getReferencePosition() {
  /**@type {Position} */
  let pos;

  if (activeNodes[0]) {
    pos = getNodePosition(activeNodes[0]);
  } else if (lastCreatedNode) {
    pos = getNodePosition(lastCreatedNode);
    debug(`lastCreatedNode: pos.x: ${pos.x}, pos.y: ${pos.y}`);
  } else {
    pos = { x: window.innerWidth / 2, y: 0 };
  }

  return pos;
}

/**
 * @summary creates a directed line from `node1` to `node2`
 * @param {OrakelLine} lineContainer
 * @param {OrakelNode} node1 start node of the line
 * @param {OrakelNode} node2 end of the line
 */
function createLine(lineContainer, node1, node2) {
  const line = lineContainer.line;

  // prevent line flipping during click event
  // keep the vector direction towards the `targetIsChild`
  if (lineContainer.type == "targetIsParent") {
    const node0 = node2;
    node2 = node1;
    node1 = node0;
  }

  const { start, length, slant } = createLineFromAToB(node1, node2);

  // stylize the line
  line.style.left = `${start.x}px`;
  line.style.top = `${start.y}px`;
  line.style.width = `${length}px`;
  line.style.transform = `rotate(${slant}deg)`;

  if (lineContainer.type == "targetIsParent") {
    /**@todo create arrow head */
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

/**
 * @summary computes the metadata need to draw a line from `A` to `B` in a 2D plane
 * @param {OrakelNode} A one end of the line
 * @param {OrakelNode} B other end of the line
 * @returns {OrakelLineMeta}
 */
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
