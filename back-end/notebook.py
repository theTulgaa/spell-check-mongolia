import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import os
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


directory = "C:/Users/Acer/OneDrive/Desktop/my project/spell-check-mongolia/back-end/dataset"
main_dir = os.listdir(directory)
file_paths = []
class_names = ["sport", "politic", "history", "health", "finance", "entertainment"]
labels = []
for fold in main_dir:
    sub_path = os.path.join(directory, fold) # joins my path to main_dir
    raw_img_path = os.listdir(sub_path) # loops through all possible paths
    for path in raw_img_path:
        img_path = os.path.join(sub_path, path) # joins image path
        file_paths.append(img_path) # adding image path to list
        labels.append(fold)
Fseries = pd.Series(file_paths, name= 'filepaths')
Lseries = pd.Series(labels, name='labels')
train_df = pd.concat([Fseries, Lseries], axis=1)
print(train_df.head())

# data cleansing
import re

# Function to clean text by removing specific characters
def clean_text(text):
    text = text.lower()
    return re.sub(r"[./'\"-,“”+]", "", text)

train_df['cleaned_text'] = ""

for idx, filepath in enumerate(train_df["filepaths"]):
    with open(filepath, 'r') as file:
        content = file.read()
        cleaned_content = clean_text(content)
        train_df.at[idx, 'cleaned_text'] = cleaned_content


train_df["cleaned_text"][0]

vectorizer = TfidfVectorizer(max_features=5000) 
X = vectorizer.fit_transform(train_df['cleaned_text'])
y = np.array(train_df["labels"])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

new_news = ["энэтхэгийн баруун хэсэгт орших дэлхийн хамгийн том алмаз өнгөлгөөний нийслэл гэгдэх сурат хотын иргэн никунж танк энэ оны тавдугаар сард ажлаа алджээ түүний долоон жил ажилласан байгууллага нь санхүүгийн хүндрэлд орж татан буугдсанаар танк болон арав гаруй хамтран ажиллагсад нь ажилгүй болсон байна гэр бүлийнхээ цор ганц тэтгэгч байсан танкийн хувьд уг явдал нь хамгийн хүнд хэцүү цаг үеийг авчирсан юм ажиллаж байх хугацаандаа хадгаламж нээгээгүй байсан бөгөөд өндөр настай эцэг эх эхнэр охиноо тэжээж чадахгүй байгаадаа сэтгэлээр унан наймдугаар сард амиа хорлож нас баржээ\nэнэтхэгийн эдийн засаг сүүлийн жилүүдэд уналтад орсон энэ нь тус улсын алмаз үйлдвэрлэлтэд мөн адил сөргөөр нөлөөлсөн юм гужарат мужийн сурат хотод дэлхийн очир эрдэнийн 90 хувийг боловсруулдаг нийт 5000 гаруй нэгж байгууллага алмаз боловсруулдаг бөгөөд 800000 гаруй өнгөлөгч ажилладаг түүнчлэн жилд 100 сая амдоллароос илүү орлого олдог 15 том өнгөлгөөний нэгж бий ерөнхийдөө сурат хот нь алмаз нийлүүлэлтийн сүлжээнд тэргүүлэгч бөгөөд орон нутгийн эдийн засаг ажлын байр дэлхийн зах зээлд нөлөөлдөг"]
new_news_vectorized = vectorizer.transform(new_news)
probabilities = model.predict_proba(new_news_vectorized)
print(probabilities * 100)

for x, y in zip(probabilities[0] * 100, class_names):
    print(f"{y} medee baih magadlal: ", x)