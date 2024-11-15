from flask import Flask, session, jsonify, request
from flask_cors import CORS
from spylls.hunspell import Dictionary
import os
import json
from flask import Response
from notebook import prediction_repsonse

app = Flask(__name__)
cors = CORS(app, origins='*')

dir = os.path.dirname(os.path.realpath(__file__)) + '/languages/mn_Mn'

dictionary = Dictionary.from_files(dir)

@app.route('/')
def index():
    suggestions = {}
    words = session.get('input', 'No_data_found').split()
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

    response_message = f"{message}"
    session['input'] = response_message

    return jsonify({"response": response_message})

# ene huselt text analyze hiihed hereglegdne. Odoo jo aldaa garaad bga sda mni
@app.route('/predict')
def predict():
    data = request.json
    new_news = data.get("input_text", "")
    prediction_result = prediction_repsonse(new_news)

    return jsonify(prediction_result)

if __name__ == "__main__":
  app.run(debug=True, port=8080)