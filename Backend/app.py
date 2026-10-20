from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import re

app = Flask(__name__)

CORS(app)

model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

def clean_text(text):
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

@app.route('/', methods=['GET'])
def home():
    return jonify({
        "status": "success",
        "Messsage": "Welcome to the Sentiment Analysis API. Sentiment analysis API is running.. !",
        "endpoint": {
            "POST /predict": "Send {'text': 'Your review text here'} to get the sentiment prediction.",
        }
    })

