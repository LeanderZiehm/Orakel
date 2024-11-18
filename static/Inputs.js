//handles all input methods like UI, keyboard, mouse, events, etc.
console.log("Inputs.js");

let isDragging = false;
let draggedNode = null;
let startDragPosX = 0;
let startDragPosY = 0;
let clickedBackgroundPosition = { x: 0, y: 0 };
let isDraggingBackground = false;
let offsetXBackground = 0;
let offsetYBackground = 0;
let isHoldingCtrl = false;
let isHoldingShift = false;
let isHoldingAlt = false;

const promptTxtBox = document.querySelector("#promptTxt");
const nodeListContainer = document.getElementById("nodeListContainer");

// selection handlers
function singleSelect(node) {
  activeNodes.forEach((activeNode) => activeNode.classList.remove("active"));
  activeNodes = [];

  node.classList.add("active");
  activeNodes.push(node);
}

function multiSelect(node) {
  debug("multiSelect");
  activeNodes.push(node);
  node.classList.add("active");
}
// end selection handlers
// node handlers

/**
  @description attaches required events to the new node.  following events are subscribed:
    - toggling context state when _double clicked_
    - multiselect when _clicked_ **and** holding _shift_
    - drag trigger when _clicked on_ wwithout holding _strl_ or _shift_
  
  @summary subscribes to neccessary events of the node
 * @param {HTMLDivElement} node node in question
 */
function subscribeNodeEvents(node) {
  node.addEventListener("dblclick", () => {
    toggleContext(node);
  });

  node.addEventListener("click", () =>
    isHoldingShift ? multiSelect(node) : singleSelect(node)
  );

  node.addEventListener("pointerdown", (e) => {
    if (isHoldingCtrl || isHoldingShift) {
      return;
    }
    startDrag(e, node);
  });
}

// let mouseX = 0;
// let mouseY = 0;

// end canvas handlers
// event handlers
function keydownHandler(event) {
  promptTxtBox.focus();

  if (event.key === "Enter") {
    const text = promptTxtBox.value;
    createUserNode(text);
    sendToLLM(text, activeNodes, context); // infer new node facts
    promptTxtBox.value = "";
  } else if (event.key === "Control") {
    isHoldingCtrl = true;
  } else if (event.key === "Shift") {
    isHoldingShift = true;
  } else if (event.key === "Alt") {
    isHoldingAlt = true;
  } else if (event.key === "Delete") {
    activeNodes.forEach((node) => {
      node.lines &&
        node.lines.forEach((lineContainer) => {
          lineContainer.line.remove();
        });

      node.remove();
    });
    activeNodes = [];
  } else {
    return;
  }
}

function pointerdownHandler(event) {
  if (event.target === document.body) {
    if (isHoldingCtrl === false && isHoldingShift === false) {
      // nodes.forEach((_node) => _node.classList.remove("active"));

      activeNodes.forEach((activeNode) =>
        activeNode.classList.remove("active")
      );

      activeNodes = [];
    }

    isDraggingBackground = true;
    clickedBackgroundPosition.x = event.clientX;
    clickedBackgroundPosition.y = event.clientY;
  }
}

function keyupHandler(event) {
  if (event.key === "Control") {
    isHoldingCtrl = false;
  } else if (event.key === "Shift") {
    isHoldingShift = false;
  } else if (event.key === "Alt") {
    isHoldingAlt = false;
  }
}

function startDrag(event, node) {
  isDragging = true;
  draggedNode = node;
  startDragPosX = event.clientX;
  startDragPosY = event.clientY;

  node.style.cursor = "grabbing";
}

function stopDrag() {
  isDraggingBackground = false;
  isDragging = false;
  if (draggedNode) {
    draggedNode.style.cursor = "pointer";
  }
  draggedNode = null;
}

function onDrag(event) {
  if (isDraggingBackground) {
    offsetXBackground = event.clientX - clickedBackgroundPosition.x;
    offsetYBackground = event.clientY - clickedBackgroundPosition.y;
    clickedBackgroundPosition.x = event.clientX;
    clickedBackgroundPosition.y = event.clientY;

    nodes.forEach((node) => {
      const x = node.getBoundingClientRect().left + offsetXBackground;
      const y = node.getBoundingClientRect().top + offsetYBackground;
      setNodePosition(node, x, y);
    });
  }

  if (isHoldingCtrl || isHoldingShift) {
    // because now user wants to resize the window
    return;
  }

  if (!isDragging || !draggedNode) {
    return;
  }

  let offsetX = event.clientX - startDragPosX;
  let offsetY = event.clientY - startDragPosY;

  startDragPosX = event.clientX;
  startDragPosY = event.clientY;

  const x = draggedNode.getBoundingClientRect().left + offsetX;
  const y = draggedNode.getBoundingClientRect().top + offsetY;

  setNodePosition(draggedNode, x, y);

  draggedNode.lines.forEach((lineContainer) => {
    if (
      !isHoldingAlt &&
      lineContainer.type == "targetIsChild" &&
      lineContainer.target.dataset.userNode !== "true"
    ) {
      const child = lineContainer.target;
      const x = child.getBoundingClientRect().left + offsetX;
      const y = child.getBoundingClientRect().top + offsetY;
      setNodePosition(child, x, y);
    }
  });
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("pointerdown", pointerdownHandler);
document.addEventListener("pointerup", stopDrag);
document.addEventListener("pointermove", onDrag);
