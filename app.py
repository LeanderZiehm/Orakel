import subprocess
import os
import json
from flask import Flask, render_template, request, jsonify, send_file
from io import BytesIO
import base64
from PIL import Image
import requests

# populate exec env
env = ""
if os.path.isfile(".env"):
    f = open(".env")
    env = f.read()
    f.close()
env = {k: v for k, v in (tuple(t.split("=")) for t in [l for l in env.split()])}


# modelName = 'tinyllama'
# modelName = 'llama3.1'
modelName = env["MODEL"] if "MODEL" in env else "llama3.1"

if modelName != "None":
    import ollama

if env["StableDiffusion"] != "None":
    from diffusers import AutoPipelineForText2Image
    import torch

    pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sd-turbo", torch_dtype=torch.float16, variant="fp16")
    pipe.to("cuda")


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("graph.html")


@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    systemPrompt = """System: Respond only with a Python array with at least items, following these guidelines:
Your answer should be a Python list in this format: ["item1", "item2", "item3"]
Do not add any extra words or explanations outside the array.
Only list items that directly answer the question"""

    promptContent = f"System: {systemPrompt}\n User:{user_message}"

    print(f"User:{user_message}")

    if modelName == "None":
        return jsonify({"response": [user_message]})

    response = ollama.chat(model=modelName, messages=[{"role": "user", "content": promptContent}])
    # print(response['message']['content'])
    chatbot_message = response["message"]["content"]  # f"I got:{user_message}. I give: " + response['message']['content']

    # remove [ and ] and split by comma
    # print(f"Chatbot Message:{chatbot_message}")
    chatbot_message = chatbot_message.replace('"', "").replace("[", "").replace("]", "")
    items = chatbot_message.split(",")
    print(f"Items:{items}")
    # return jsonify({'response':[chatbot_message]})
    return jsonify({"response": items})


def generate_image(prompt):
    # Generate the image based on the prompt
    image = pipe(prompt=prompt, num_inference_steps=1, guidance_scale=0.0).images[0]

    # Save the image to a byte buffer
    buffered = BytesIO()
    image.save(buffered, format="PNG")

    # Encode the image to base64
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str


# Define the route for generating images
@app.route("/image", methods=["POST"])
def generate():

    if env["StableDiffusion"] == "None":
        image_url = "https://picsum.photos/1024/1024"

        # Fetch the image from the URL
        response = requests.get(image_url)

        if response.status_code == 200:
            # Open the image from the response content
            img = Image.open(BytesIO(response.content))

            # Convert image to a byte stream
            img_byte_arr = BytesIO()
            img.save(img_byte_arr, format="PNG")  # or 'JPEG', based on your needs
            img_byte_arr = img_byte_arr.getvalue()

            # Encode image bytes to base64
            img_base64 = base64.b64encode(img_byte_arr).decode("utf-8")

            # Return base64 string in a JSON response
            return jsonify({"image_base64": img_base64})

    else:
        # Get the prompt from the JSON request
        data = request.json
        prompt = data.get("prompt", "")

        # Generate the image if prompt is not empty
        if prompt:
            generated_image = generate_image(prompt)
            return jsonify({"image_base64": generated_image})
        else:
            return jsonify({"error": "No prompt provided"}), 400

@app.route("/render", methods=["POST"])
def renderPNG():
    dot_file = """
graph happiness {
	layout=twopi; graph [ranksep=2];
"""
    state = json.loads(request.json.get('state'))
    nodes = state['nodes']
    # p -- { children}
    edges = state['edges']


    # graph = {k['id']: [] for k in nodes}
    # for e in edges:
    #     child = e['self']
    #     for p in e['parents']:
    #         graph[p].append(graph[child])
    # print(graph)

    nodes_grp = "\n".join(map(lambda n: n['payload'], nodes))
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
    png = 'tmp.png'
    subprocess.run(
        ["dot", "-Tpng", "tmp.dot", "-o", png],
        check=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )

    return send_file(png,mimetype="image/png", as_attachment=True)

if __name__ == "__main__":
    PORT = int(env["PORT"]) if "PORT" in env else 5002
    HOST = env["HOST"] if "HOST" in env else "127.0.0.1"
    app.run(debug=True, port=PORT, host=HOST)


##########
