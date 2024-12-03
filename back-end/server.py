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
dir_en = os.path.dirname(os.path.realpath(__file__)) + '/languages/en_US'

dictionary = Dictionary.from_files(dir)
en_dict = Dictionary.from_files(dir_en)

transfer = """
"""

@app.route('/')
def index():

    # suggestions = {}
    # # original text
    # original_text_from_front_end = transfer
    # # cleaned text
    # remove_chars = "./:;?<>!-_+=\'\","
    # cleaned_text = original_text_from_front_end.translate(str.maketrans("", "", remove_chars)).split()
    # # original text as list sda mni
    # original_text_from_front_end = original_text_from_front_end.split()
    # for original_text, cleaned_text in zip(original_text_from_front_end, cleaned_text):
    #     if not dictionary.lookup(cleaned_text):
    #         suggestions[original_text] = list(dictionary.suggest(cleaned_text))

            
    # response_data = {'suggestions': suggestions}
    # json_data = json.dumps(response_data, ensure_ascii=False)
    # return Response(json_data, content_type="application/json; charset=utf-8")



    suggestions = {}
    words = transfer.split()

    chars = '"\'.-,:;'
    print(chars[1])
    
    for word in words:
        check = False
        ind = -1
        ch = ''


        if not dictionary.lookup(word):  
            print(word)
            if not en_dict.lookup(word):

                for i in range(len(chars)):
                    print(chars[i])
                    if chars[i] in word:
                        check = True
                        ch = chars[i]
                        ind = 1 if word.index(chars[i]) > 0 else 0
                        break
                if not check:
                    suggestions[word] = 1
                else:
                    if ind:
                        if not dictionary.lookup(word[:-1]):  
                            print(word, 1)
                            if not en_dict.lookup(word[:-1]):
                                suggestions[word] = 1
                    else:

                        if not dictionary.lookup(word[1:]):  
                            print(word, 2)
                            if not en_dict.lookup(word[1:]):
                                suggestions[word] = 1

        # else:
        #     if ind == 0:
        #         if not dictionary.lookup(word[1:]):  
        #             print(word)
        #             if not en_dict.lookup(word[1:]):
        #                 suggestions[word] = 1

        #     elif word[-1] == ch:
        #         if not dictionary.lookup(word[:-1]):  
        #             print(word)
        #             if not en_dict.lookup(word[:-1]):
        #                 suggestions[word] = 1
    print(suggestions)
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
    
    if word[0].isalpha() and word[0].isascii():
        suggestions = list(en_dict.suggest(word))
    else:
        suggestions = list(dictionary.suggest(word))

    return jsonify({"response": suggestions})

if __name__ == "__main__":
  app.run(debug=True, port=8080)