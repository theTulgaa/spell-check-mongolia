from flask import Flask, jsonify, request
from flask_cors import CORS
from spylls.hunspell import Dictionary
import os
import json
from flask import Response
import notebook

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
          sugs = []
          for sug in dictionary.suggest(word):
            sugs.append(sug)
            if len(sugs) > 3: break
          suggestions[word] = sugs

          # suggestions[word] = list(dictionary.suggest(word))

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

@app.route('/predict')
def predict():
    global transfer
    if not transfer or transfer == '' or transfer == '\n':
       return jsonify({'prediction': 'NO_INPUT_DATA'})
    data = [transfer]
    ob = notebook
    prediction_result = ob.prediction_repsonse(data)

    response_data = {'prediction': prediction_result}
    json_data = json.dumps(response_data, ensure_ascii=False)
    return Response(json_data, content_type="application/json; charset=utf-8")

if __name__ == "__main__":
  app.run(debug=True, port=8080)