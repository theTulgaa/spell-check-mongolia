from flask import Flask, jsonify, request
from flask_cors import CORS
from spylls.hunspell import Dictionary
import os
import json
from flask import Response
import notebook
import numpy as np

app = Flask(__name__)
cors = CORS(app, origins='*')

dir = os.path.dirname(os.path.realpath(__file__)) + '/languages/mn_Mn'

dictionary = Dictionary.from_files(dir)

transfer = """
"""

@app.route('/')
def index():
    suggestions = {}
    words = transfer.split()
    for word in words:
        if not dictionary.lookup(word):  
          suggestions[word] = list(dictionary.suggest(word))
    response_data = {'suggestions': suggestions}
    json_data = json.dumps(response_data, ensure_ascii=False)
    return Response(json_data, content_type="application/json; charset=utf-8")

@app.route('/send', methods=['POST'])
def receive_message():
    data = request.json
    message = data.get("message", "")
    global transfer

    response_message = f"{message}"
    transfer = response_message

    return jsonify({"response": response_message})

if __name__ == "__main__":
  app.run(debug=True, port=8080)