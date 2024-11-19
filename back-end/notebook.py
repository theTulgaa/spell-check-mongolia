import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import os
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np 

app = Flask(__name__)
cors = CORS(app, origins='*')
CORS(app)


directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dataset')

main_dir = os.listdir(directory)
file_paths = []
class_names = ["sport", "politic", "history", "health", "finance", "entertainment"]
labels = []
for fold in main_dir:
    sub_path = os.path.join(directory, fold) 
    raw_img_path = os.listdir(sub_path)
    for path in raw_img_path:
        img_path = os.path.join(sub_path, path)
        file_paths.append(img_path) 
        labels.append(fold)
Fseries = pd.Series(file_paths, name= 'filepaths')
Lseries = pd.Series(labels, name='labels')
train_df = pd.concat([Fseries, Lseries], axis=1)

import re
def clean_text(text):
    text = text.lower()
    return re.sub(r"[./'\"-,“”+]", "", text)

train_df['cleaned_text'] = ""

for idx, filepath in enumerate(train_df["filepaths"]):
    with open(filepath, 'r') as file:
        content = file.read()
        cleaned_content = clean_text(content)
        train_df.at[idx, 'cleaned_text'] = cleaned_content

vectorizer = TfidfVectorizer(max_features=5000) 
X = vectorizer.fit_transform(train_df['cleaned_text'])
y = np.array(train_df["labels"])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

def prediction_response(news):
    news = clean_text(news)
    news = re.split(r'(?<=\.)\s*', news)
    new_news_vectorized = vectorizer.transform(news)
    probabilities = model.predict_proba(new_news_vectorized)
    return probabilities



@app.route('/', methods=['POST'])
def predict():
    data = request.get_json() 
    text = data.get('inputText')
    
    if not text:
        return jsonify({'error': 'No input text provided'}), 400
    prediction = prediction_response(text)
    prediction_list = prediction.tolist() if isinstance(prediction, np.ndarray) else prediction

    return jsonify({'prediction': prediction_list})


if __name__ == "__main__":
    app.run(port=5002, debug=True)