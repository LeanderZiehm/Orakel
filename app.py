from flask import Flask, render_template, request, jsonify
import ollama

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    response = ollama.chat(
        model='llama3.1',
        messages=[
            {
                'role': 'user',
                'content': user_message
            },
            {
                'role': 'system',
                'content': 'Provide responses that dig deeper into the user\'s motivations and underlying concerns behind their questions, especially in a spiritual or existential context.'
            }
        ]
    )

    chatbot_message = response['message']['content']
    return jsonify({'response': chatbot_message})

if __name__ == '__main__':
    app.run(debug=True)
