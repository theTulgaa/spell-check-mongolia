import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import os
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


# directory = "dataset"
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
# print(train_df.head())

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


# train_df["cleaned_text"][0]

vectorizer = TfidfVectorizer(max_features=5000) 
X = vectorizer.fit_transform(train_df['cleaned_text'])
y = np.array(train_df["labels"])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
# print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

def prediction_repsonse(new_news):
    
    new_news_vectorized = vectorizer.transform(new_news)
    probabilities = model.predict_proba(new_news_vectorized)
    return probabilities

# for x, y in zip(probabilities[0] * 100, class_names):
#     print(f"{y} medee baih magadlal: ", x)