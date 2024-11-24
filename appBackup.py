from flask import Flask, render_template, request, jsonify, session
import ollama

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session management


SYSTEM_PROMPT = """You answer consisely and mostly reflect the users emothins and intentions and ask questions.
You don't give insigts or advice you leave that to profesional humans.
You know that you are limited and don't know much but you want to help people understand themselfes. 
You reflect on the motivations and desires of the people that ask quesions and answers by asking about the questioner's motivations and desires."""



# Define a function to handle queries to the LLM
def get_response(user_message):
    # Retrieve or initialize chat history from session
    chat_history = session.get('chat_history', [])

    # Send user message along with the conversation history to Ollama
    # messages = [{'role': 'user', 'content': msg['user']} for msg in chat_history]
    # messages.append({'role': 'user', 'content': user_message})
    
    chat_history.append({'role': 'user', 'content': user_message})
    
    response = ollama.chat(
        model='llama3.1',
        messages=chat_history
    )

    # Get model's response
    llm_response = response['message']['content']
    
    chat_history.append({'role': 'you', 'content': llm_response})
    
    session['chat_history'] = chat_history

    return llm_response

# Route for the homepage, asking the first question
@app.route('/')
def home():
    # Initial question for the user
    opening_question = "What question is on your mind today?"
    
    session['chat_history'] = [{'role': 'system', 'content': SYSTEM_PROMPT}] 
    
    return render_template('index.html', opening_question=opening_question)

# Route to handle user responses
@app.route('/ask', methods=['POST'])
def ask():
    user_message = request.form['user_message']
    
    # Get LLM's response
    llm_response = get_response(user_message)
    
    # Process LLM's response and return to the user
    return jsonify({'response': llm_response})

# Route to handle clearing the chat history
@app.route('/new_chat', methods=['POST'])
def new_chat():
    session['chat_history'] = []  # Clear chat history in session
    return jsonify({'message': 'Chat history cleared.'})

if __name__ == '__main__':
    app.run(debug=True)
