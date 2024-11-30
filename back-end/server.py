from flask import Flask, jsonify, request
from flask_cors import CORS
from spylls.hunspell import Dictionary
import os
import json
from flask import Response
from notebook import prediction_response
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
            # suggestions[word] = list(dictionary.suggest(word))
            suggestions[word] = 1
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

@app.route('/pred', methods=['POST'])
def predict():
    data = request.get_json() 
    text = data.get('inputText')
    
    if not text:
        return jsonify({'error': 'No input text provided'}), 400
    prediction = prediction_response(text)
    prediction_list = prediction.tolist() if isinstance(prediction, np.ndarray) else prediction

    return jsonify({'prediction': prediction_list})

@app.route('/suggest', methods=['POST'])
def suggest():
    suggestions = {}
    data = request.json
    word = data.get("message", "")
    suggestions = list(dictionary.suggest(word))

    return jsonify({"response": suggestions})

if __name__ == "__main__":
  app.run(debug=True, port=8080)