//handles all input methods like UI, keyboard, mouse, events, etc.
console.log("Inputs.js");

let isDragging = false;

/**@type {OrakelNode|null} */
let draggedNode;

/**@type {Position} */
let clickedBackgroundPosition = { x: 0, y: 0 };

let startDragPosX = 0;
let startDragPosY = 0;

let isDraggingBackground = false;

let offsetXBackground = 0;
let offsetYBackground = 0;

// flags for user modifiers
let isHoldingCtrl = false;
let isHoldingShift = false;
let isHoldingAlt = false;

/**@type {HTMLInputElement|null} */
const promptTxtBox = document.querySelector("#promptTxt");
const nodeListContainer = document.getElementById("nodeListContainer");

/**
 * @summary selects a single node
 * @param {OrakelNode} node
 */
function singleSelect(node) {
  activeNodes.forEach((activeNode) => activeNode.classList.remove("active"));
  activeNodes = [];

  node.classList.add("active");
  activeNodes.push(node);
}

/**
 * @summary selects multiple nodes
 * @param {OrakelNode} node
 */
function multiSelect(node) {
  debug("multiSelect");
  activeNodes.push(node);
  node.classList.add("active");
}

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

/**
 * @summary toggles flag/triggers functions according to the key pressed by the user
 * @description toggles flags which indeicates the pressed keys if any of the meta keys were
 * pressed. also triggers delete functionality if delete key-sequence is pressed.
 * @param {KeyboardEvent} event event given by the browser
 * @returns {void}
 */
function keydownHandler(event) {
  promptTxtBox?.focus();

  if (event.key === "Enter") {
    if (promptTxtBox === null) {
      debug("[keydownHandler] promptBox input element is not detected");
      throw Error("Imporper DOM");
    }

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

/**
 * @summary toggles active state/drags the node
 * @param {PointerEvent} event event object given by the browser
 */
function pointerdownHandler(event) {

//check if pointer right click

    if (event.button === 2) {
        debug("right click, stop pointerdownHandler");
        return;
    }


  if (event.target === document.body) {
    if (isHoldingCtrl === false && isHoldingShift === false) {
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

/**
 * @summary disables the flag according to the modifier key pressed
 * @param {KeyboardEvent} event
 */
function keyupHandler(event) {
  if (event.key === "Control") {
    isHoldingCtrl = false;
  } else if (event.key === "Shift") {
    isHoldingShift = false;
  } else if (event.key === "Alt") {
    isHoldingAlt = false;
  }
}

/**
 * @summary sets up the environment for the drag handler to work
 * @param {PointerEvent} event
 * @param {OrakelNode} node node the user has selected to drag
 */
function startDrag(event, node) {
  isDragging = true;
  draggedNode = node;
  startDragPosX = event.clientX;
  startDragPosY = event.clientY;

  node.style.cursor = "grabbing";
}

/**
 * @summary resets the environment when a drag is finished
 */
function stopDrag() {
  isDraggingBackground = false;
  isDragging = false;
  if (draggedNode) {
    draggedNode.style.cursor = "pointer";
  }

  draggedNode = null;
}

/**
 * @summary drags the selected node(s) along with user's pointer movement
 * @param {PointerEvent} event
 * @returns {void}
 */
function onDrag(event) {
  if (isDraggingBackground) {
    offsetXBackground = event.clientX - clickedBackgroundPosition.x;
    offsetYBackground = event.clientY - clickedBackgroundPosition.y;
    clickedBackgroundPosition.x = event.clientX;
    clickedBackgroundPosition.y = event.clientY;

<<<<<<< Updated upstream
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

  draggedNode.lines?.forEach((lineContainer) => {
    if (
      !isHoldingAlt /* is user is holding Alt, then only move the node */ &&
      lineContainer.type == "targetIsChild" /* only move the child */ &&
      lineContainer.target.dataset.userNode !== "true"
    ) {
      const child = lineContainer.target;
      const x = child.getBoundingClientRect().left + offsetX;
      const y = child.getBoundingClientRect().top + offsetY;
      setNodePosition(child, x, y);
    }
  });
=======
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



    for (let i = 0; i < activeNodes.length; i++) {
        const activeNode = activeNodes[i];
        const x = activeNode.getBoundingClientRect().left + offsetX;
        const y = activeNode.getBoundingClientRect().top + offsetY;

        setNodePosition(activeNode, x, y);
        activeNode.lines.forEach((lineContainer) => {
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

    // const x = draggedNode.getBoundingClientRect().left + offsetX;
    // const y = draggedNode.getBoundingClientRect().top + offsetY;

    // setNodePosition(draggedNode, x, y);


>>>>>>> Stashed changes
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("pointerdown", pointerdownHandler);
document.addEventListener("pointerup", stopDrag);
document.addEventListener("pointermove", onDrag);
<<<<<<< Updated upstream
=======






function insertCSS() {
    const cssText = `
          .selection-box {
      position: absolute;
      background-color: rgba(0, 0, 255, 0.2);
      border: 1px solid blue;
      pointer-events: none;
      z-index: 1000;
    }`;
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(cssText));
    document.head.appendChild(style);
}
insertCSS();


let startX, startY, selectionBox;

document.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu
document.addEventListener('mousedown', (e) => {

    // debug("mousedown",e);
    if (e.button !== 2) return; // Only respond to right-click
    startX = e.clientX;
    startY = e.clientY;
    // Create the selection box element
    selectionBox = document.createElement('div');
    selectionBox.classList.add('selection-box');
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    document.body.appendChild(selectionBox);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});
function onMouseMove(e) {
    const currentX = e.clientX;
    const currentY = e.clientY;
    // Update selection box dimensions
    selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
    selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
    selectionBox.style.left = `${Math.min(currentX, startX)}px`;
    selectionBox.style.top = `${Math.min(currentY, startY)}px`;
}
function onMouseUp(e) {
    if (e.button !== 2) return; // Only respond to right-click
    // Remove the selection box

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    const selectionBoundingBox = selectionBox.getBoundingClientRect();
    selectionBox.remove();
 
    debug(selectionBoundingBox);
    nodes.forEach(node => {
        const nodeBoundinBox = node.getBoundingClientRect();
        if (rectsIntersect(selectionBoundingBox, nodeBoundinBox)) {
            // box.classList.add('active');
            multiSelect(node);
            debug(nodeBoundinBox)
        }
    });
}
function rectsIntersect(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}
>>>>>>> Stashed changes
