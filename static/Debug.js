// Handels all debug related functions like loggin and ui for devs
console.log("Debug.js");


let debugDiv;



function main(){
    insertCSS();
    insertHTML();
    debugDiv = document.getElementById("debug");
    debug("Debugging is enabled");
}


function debugString(str) {
    const div = document.createElement("div");
    div.textContent = str;
    debugDiv.appendChild(div);
    // console.log(str);
}


function debug(input) {
    if (typeof input === "string") {
        debugString(input);
    } else if (typeof input === "object") {
        debugObject(input);
    } else if (typeof input === "array") {
        debugArray(input);
    }
    // else {
    //     debug("Unknown type of input");
    // }
}

//add a funtion that can take an object and print it in a readable way
function debugObject(obj){
    debug(JSON.stringify(obj, null, 2));
}

function debugArray(arr){
    debug(JSON.stringify(arr, null, 2));
}



function insertCSS(){
    const cssText = `      #debug {
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
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(cssText));
    document.head.appendChild(style);
}
function insertHTML(){
    const debugDiv = document.createElement("div");
    debugDiv.id = "debug";
    document.body.appendChild(debugDiv);
}



document.addEventListener("DOMContentLoaded", main);