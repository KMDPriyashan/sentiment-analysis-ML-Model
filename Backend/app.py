from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import re

app = Flask(__name__)

CORS(app)

model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')

