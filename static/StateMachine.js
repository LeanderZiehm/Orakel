// here will be the save and load of the state as json and undo and redo of user actions
console.log("StateMachine.js");


const btnSaveState = document.getElementById("btnSave");
const btnSavePNG = document.getElementById("btnSavePNG");

// dumpState
btnSaveState.addEventListener("click", dumpState);
btnSavePNG.addEventListener("click", renderState);



let nodes = []; // The nodes that are currently on the screen
let activeNodes = []; // The node that is currently selected
let context = []; // The nodes + type that are in the context state
let lastCreatedNode;
let uid = 2003;





/*
      ** state machine
      Node := {
        id: integer, // unique identifier
        payload: string, // content in the node
        top: integer, // top value in style
        left: integer, // left value in style
      };

      State := {
        nodes: Array<Node>,
        edges: Arraz<{
          self: Node, // node in ctx
          parents: Array<Node>, // parents
        }>
      };

      Note: Instead of storing children, I store the parents
      as it is easier to get all the parents using `activeNodes`
      */
let state = {
    nodes: [],
    edges: [],
};

function updateState(node) {
    /*
            update the state at this point so that the
            nodes created by the LLM is aware of this node as well
  
            control-flow:
            1. create instance of this Node
            2. add it to state
            3. computcontenthe edges
            4. addnodeXes to the state
          */
    //! refactoring
    return;
    debug("state: " + JSON.stringify(state, null, 2));
    const new_node = {
        id: uid,
        payload: text,
        left: left,
        top: top,
    };
    state.nodes.push(new_node);

    let parents = context;

    if (context.length > 0) {
        let parent_ids = [];
        for (let i = 0; i < parents.length; i++) {
            parent_ids.push(parents[i].dataset.nodeId);
        }

        state.edges.push({
            self: uid,
            parents: parent_ids,
        });
    }
}

async function renderState() {
    debug("dumping state");

    const stateStr = JSON.stringify(state);
    const res = await fetch("/render", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: stateStr }),
    });

    const blobURI = await res.blob();
    const file = window.URL.createObjectURL(blobURI);
    window.location = file;
}

function dumpState() {
    //from: https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    const dataURI =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(state, null, 2));

    const downloadElem = document.createElement("a");
    downloadElem.setAttribute("href", dataURI);
    downloadElem.setAttribute("download", "state.json");

    document.body.appendChild(downloadElem);

    downloadElem.click(); // programatically click the element
    downloadElem.remove();
}
// end - state machine