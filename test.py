import ollama
response = ollama.chat(model='llama3.1', messages=[
  {
    'role': 'user',
    'content': 'why is sky dark in the night?',
  },
])
print(response['message']['content'])