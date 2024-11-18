/**
 * @typedef {{method: string; headers: Object.<string, string>; body: string;}} RequestOptions
 * @summary Standardized way to construct body
 */

/**
  @summary creates request with standardized schema
  @param {Object} message object that needs to be send to api
  @param {string} [method="POST"] HTTP method that needs to be made
  @returns {RequestOptions} an Options object that can be passed to `fetch`
*/
function createRequest(message, method = "POST") {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  };
}

// LLM brokers
/**
 * @function sendToLLM
 * @summary Send the user prompt to the model along with context and the active nodes
 * and creates new nodes using {@link createLLMNodes}
 *
 * @param {string} nodeText current prompt from the user
 * @param {Array<HTMLDivElement>} activeNodes nodes with the active state
 * @param {Array<HTMLDivElement>} context nodes in the contextual memory
 * @returns {void}
 */
function sendToLLM(nodeText, activeNodes, context) {
  if (nodeText === "") {
    console.error("SendToLLM called with empty text");
    return;
  }

  /**
   * @type {string}
   * @description construct prompt for the backend. the schema is:
   * [ <each node content with csv> connected to <last element> ]
   */
  let promptForLLM = "";
  promptForLLM += activeNodes.map((node) => node.textContent).join(",\n");
  promptForLLM += context.map((node) => node.textContent).join("\n");

  debug("[sendToLLM]: constructed prompt: " + promptForLLM);

  fetch("/chat", createRequest({ message: promptForLLM }))
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
