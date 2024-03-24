from flask import Flask, request, jsonify

import pickle
import string
from nltk.corpus import stopwords
import nltk
from nltk.stem.porter import PorterStemmer


# Run the following line only once
# nltk.download('punkt')

ps = PorterStemmer()

app = Flask(__name__)


def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    return " ".join(y)


# Loading the models

tfidf = pickle.load(open('./models/vectorizer.pkl', 'rb'))
model = pickle.load(open('./models/model.pkl', 'rb'))


# Creating the routes

@app.get('/api')
def index():
    return jsonify({"status": "OK"})


@app.post('/api/predict')
def predict():
    payload = request.json
    msg = payload.get('message')
    if msg:
       # 1. preprocessing
        transformed_msg = transform_text(msg)

        # 2. vectorization
        vector_input = tfidf.transform([transformed_msg])

        # 3. predicting
        prediction = model.predict(vector_input)[0]

        return jsonify({"prediction": str(prediction)})

    return jsonify({"error": "Invalid request"})


app.run(host="0.0.0.0", port=80, debug=True)
