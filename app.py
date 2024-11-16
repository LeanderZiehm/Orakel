import subprocess
import os
import json
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory

# populate exec env
env = ""
if os.path.isfile(".env"):
    f = open(".env")
    env = f.read()
    f.close()
env = {k: v for k, v in (tuple(t.split("="))
                         for t in [l for l in env.split()])}


modelName = env["MODEL"] if "MODEL" in env else "llama3.1"
if modelName != "None":
    import ollama


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("graph.html")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/vnd.microsoft.icon")


i = 0


@app.route("/chat", methods=["POST"])
def chat():
    global i
    print(i)
    i += 1
    user_message = request.json.get("message")

    systemPrompt = """System: Respond only with a Python array with at least items, following these guidelines:
Your answer should be a Python list in this format: ["item1", "item2", "item3"]
Do not add any extra words or explanations outside the array.
Only list items that directly answer the question"""

    promptContent = f"System: {systemPrompt}\n User:{user_message}"

    print(f"User:{user_message}")

    if modelName == "None":
        return jsonify({"response": ["response1response1response1", "response2response2response2", "response3response3response3"]})
        # return jsonify({"response": ["response1", "response2", "response3"]})

    response = ollama.chat(model=modelName, messages=[
                           {"role": "user", "content": promptContent}])
    # print(response['message']['content'])
    # f"I got:{user_message}. I give: " + response['message']['content']
    chatbot_message = response["message"]["content"]

    # remove [ and ] and split by comma
    # print(f"Chatbot Message:{chatbot_message}")
    chatbot_message = chatbot_message.replace(
        '"', "").replace("[", "").replace("]", "")
    items = chatbot_message.split(",")
    print(f"Items:{items}")
    # return jsonify({'response':[chatbot_message]})
    return jsonify({"response": items})


@app.route("/render", methods=["POST"])
def renderPNG():
    dot_file = """
graph happiness {
	layout=twopi; graph [ranksep=2];
"""
    state = json.loads(request.json.get("state"))
    nodes = state["nodes"]
    edges = state["edges"]

    nodes_grp = "\n".join(map(lambda n: n["payload"], nodes))
    dot_file += "\n"
    dot_file += nodes_grp.replace("[", "").replace("]", "")
    dot_file += "\n}"

    f = ""
    try:
        f = open("tmp.dot", "x")
    except FileExistsError:
        f = open("tmp.dot", "w")
    f.write(dot_file)
    f.close()

    #!dangerous: running arbitrary system cmd; but ok for now
    #!-- Birnadin Erick :P
    png = "tmp.png"
    subprocess.run(["dot", "-Tpng", "tmp.dot", "-o", png],
                   check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return send_file(png, mimetype="image/png", as_attachment=True)


if __name__ == "__main__":
    PORT = int(env["PORT"]) if "PORT" in env else 5002
    HOST = env["HOST"] if "HOST" in env else "127.0.0.1"
    app.run(debug=True, port=PORT, host=HOST)


##########
