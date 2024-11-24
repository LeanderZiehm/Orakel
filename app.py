from flask import Flask, render_template, request, jsonify, session
import ollama
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session management

file_path = 'SystemPrompt.txt'  # Adjust the path if needed

with open(file_path, 'r') as file:
    SYSTEM_PROMPT = file.read().strip()
    

# Directory to save conversation JSON files
CONVERSATION_DIR = 'conversations'

# Ensure the conversation directory exists
os.makedirs(CONVERSATION_DIR, exist_ok=True)


# Function to save conversation to a unique JSON file
def save_conversation_to_file(chat_history):
    # Check if a conversation file has already been created for this session
    if 'conversation_filename' not in session:
        # Generate a unique filename based on the current timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"conversation_{timestamp}.json"
        session['conversation_filename'] = filename

    # Get the full path of the conversation file
    filename = session['conversation_filename']
    filepath = os.path.join(CONVERSATION_DIR, filename)

    # Add a timestamp for each message
    chat_history_with_timestamps = []
    for message in chat_history:
        message_with_timestamp = message.copy()
        message_with_timestamp['timestamp'] = datetime.now().isoformat()
        chat_history_with_timestamps.append(message_with_timestamp)

    # Prepare conversation data to save
    conversation_data = {
        'created_at': chat_history_with_timestamps[0]['timestamp'],
        'messages': chat_history_with_timestamps
    }

    # Save the conversation data to the JSON file
    with open(filepath, 'w') as f:
        json.dump(conversation_data, f, indent=4)


# Define a function to handle queries to the LLM
def get_response(user_message):
    # Retrieve or initialize chat history from session
    chat_history = session.get('chat_history', [])

    # Append user message to chat history
    chat_history.append({'role': 'user', 'content': user_message})

    # Send user message along with the conversation history to Ollama
    response = ollama.chat(
        model='llama3.1',
        messages=chat_history
    )

    # Get model's response
    llm_response = response['message']['content']

    # Append model's response to chat history
    chat_history.append({'role': 'you', 'content': llm_response})
    
    # Update session with the modified chat history
    session['chat_history'] = chat_history

    # Save the conversation to a JSON file
    save_conversation_to_file(chat_history)

    return llm_response


# Route for the homepage, asking the first question
@app.route('/')
def home():
    # Initial question for the user
    opening_question = "What question is on your mind today?"
    
    # Initialize chat history and save initial system prompt
    session['chat_history'] = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    save_conversation_to_file(session['chat_history'])  # Save the initial system prompt

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
    
    # Clear the conversation file for a new session
    session.pop('conversation_filename', None)
    
    return jsonify({'message': 'Chat history cleared.'})


if __name__ == '__main__':
    app.run(debug=True)
