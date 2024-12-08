// Handels all debug related functions like loggin and ui for devs
console.log("Debug.js");

/**@type {HTMLDivElement} */
let debugContainer;

function initDebug() {
  insertCSS();

  /** @global */
  debugContainer = insertHTML();

  debug("Debugging is enabled");
}

/**
 * prints the `input` param to the debug window on top-right corner of the page
 * @template {HTMLElement | string | number} T
 * @param {string|Object|Array<T>} input string that needs to be print to the debug aread
 *
 * @todo write test
 */
function debug(input) {
<<<<<<< Updated upstream
  const div = document.createElement("div");

  // for now, we can't print out HTMLElement to debug,
  // thus print it to console instead
  if (input instanceof Array && input[0] instanceof HTMLElement) {
    console.debug(input);
    return;
  }

  // if `input` is not string, make it JSON string
  div.textContent = typeof input === "string" ? input : JSON.stringify(input);

  /** @global */
  debugContainer.appendChild(div);
}

/**
 * @summary creates a style tag and add it to the body. this style tag
 * is these used to style the {@link debugContainer}
 *
 * @returns {void}
 */
function insertCSS() {
  const cssText = `      #debug {
=======
    if (typeof input === "string") {
        debugString(input);
    } else if (typeof input === "object") {
        debugObject(input);
    } else if (typeof input === "array") {
        debugArray(input);
    }
    else {
        debugString("Unknown type of input");
    }
console.log(input);
}


// function debug(input,input2) {
//     if (typeof input === "string") {
//         debugString(input);
//     } else if (typeof input === "object") {
//         debugObject(input);
//     } else if (typeof input === "array") {
//         debugArray(input);
//     }
//     else {
//         debugString("Unknown type of input");
//     }
//     if (typeof input2 === "string") {
//         debugString(input2);
//     } else if (typeof input2 === "object") {
//         debugObject(input2);
//     } else if (typeof input2 === "array") {
//         debugArray(input2);
//     }
//     else {
//         debugString("Unknown type of input");
//     }

//     console.log(input,input2);
// }


//add a funtion that can take an object and print it in a readable way
function debugObject(obj){
    debug(JSON.stringify(obj, null, 2));
}

function debugArray(arr){
    debug(JSON.stringify(arr, null, 2));
}



function insertCSS(){
    const cssText = `      #debug {
>>>>>>> Stashed changes
        position: absolute;
        top: 0px;
        right: 0px;
        background-color: #343434;
        color: #f7fff7;
        padding: 0px;
        z-index: 100;
        max-width: 400px;
        max-height: 90%;
        overflow-x: hidden;
        white-space: normal;
        overflow-y: auto;
        font-family: monospace;
      }`;

  // append style tag in runtime
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(cssText));
  document.head.appendChild(style);
}

/**
 * @summary creates a div node in DOM for debugging purposes
 * this div is used as an container to be able to log
 * debug messages without needing to open up console
 * @returns {HTMLDivElement}
 */
function insertHTML() {
  const debugDiv = document.createElement("div");
  debugDiv.id = "debug";
  document.body.appendChild(debugDiv);

  return debugDiv;
}

document.addEventListener("DOMContentLoaded", initDebug);
