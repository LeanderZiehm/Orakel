/*
        creates request with standardized schema
        method: POST(default), 2nd argumemnt
        headers: {Content-Type: "apllication/json"}
        body: json<{message: <message>}>
      */
function createRequest(message, method = "POST") {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  };
}


// LLM brokers
function sendToLLM(nodeText) {
  if (nodeText === "") {
    console.error("SendToLLM called with empty text");
    return;
  }
  // construct prompt for the backend. the schema is:
  // [ <each node content with csv> connected to <last element> ]
  let promptForLLM = "";
  for (let i = 0; i < activeNodes.length; i++) {
    promptForLLM += activeNodes[i].textContent + ",\n";
  }
  for (let i = 0; i < context.length; i++) {
    promptForLLM += context[i].textContent + ",\n";
  }
  // promptForLLM += context.slice(0, context.length - 1).join(",");
  // promptForL/LM += ``;
  console.debug("[sendToLLM]: constructed prompt: " + promptForLLM);
  debug("[sendToLLM]: constructed prompt: " + promptForLLM);

  fetch("/chat", createRequest(promptForLLM))
    .then((r) => r.json())
    .then((data) => {
      const texts = data["response"];
      createLLMNodes(texts);
    })
    .catch((error) => {
      console.error(error);
      console.debug("[sendToLLM]: fetch failed");
      console.debug("[sendToLLM]: prompt " + promptForLLM);
      return;
    });
}
// end LLM brokers
// canvas handlers
