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
    return jsonify({
        "status": "success",
        "Message": "Welcome to the Sentiment Analysis API. Sentiment analysis API is running.. !",
        "endpoint": {
            "POST /predict": "Send {'text': 'Your review text here'} to get the sentiment prediction.",
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({"error": "Invalid input. Please provide a 'text' field in the JSON payload."}), 400

        user_text = data['text'].strip()

        if not user_text:
            return jsonify({"error": "The 'text' field cannot be empty."}), 400

        cleaned_text = clean_text(user_text)
        text_vec = vectorizer.transform([cleaned_text])
        prediction = model.predict(text_vec)[0]
        probability = model.predict_proba(text_vec)[0]

        result = {
            "text": user_text,
            "sentiment": "positive" if prediction == 1 else "negative",
            "confidence": round(float(max(probability))*100, 2),
            "probabilities": {
                "positive": round(float(probability[1])*100, 2),
                "negative": round(float(probability[0])*100, 2)
            }
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)