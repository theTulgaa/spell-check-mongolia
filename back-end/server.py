<<<<<<< HEAD
from flask import Flask, jsonify, request
from flask_cors import CORS
from spylls.hunspell import Dictionary
import os
import json
from flask import Response
import notebook

import algorithms.analysis as analysis

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

@app.route('/predict', methods=['POST'])
def predict():
   
   data = request.get_json()
   text = data['inputText']
   ob = notebook
   return jsonify({'prediction': ob.prediction_repsonse(text)})

@app.route('/frequency', methods=['POST'])
def frequency():
    try:
        # Клиентээс ирсэн текстийг JSON-оос авна
        data = request.get_json()
        input_text = data.get('inputText', '')

        if not input_text:
            return jsonify({"error": "Хоосон текст илгээж болохгүй."}), 400

        words = input_text.split(" ")
        stems = analysis.different_stems(words)
        result = analysis.count_stems(stems, words)

        # Үгийн давтамжийг JSON форматаар буцаах
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
=======
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
>>>>>>> 045ced0fe588edd84c6c803b7e6565e647e756b3
  app.run(debug=True, port=8080)