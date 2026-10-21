# Sentiment Analysis

A lightweight sentiment analysis application that classifies review text as
**positive** or **negative**. It includes a browser-based interface and a Flask
API backed by a pre-trained scikit-learn model.

## Features

- Analyze a review through a simple web interface.
- Get a sentiment label, overall confidence, and positive/negative probabilities
  from the API.
- Normalize text before inference by removing HTML tags, non-English letters,
  and extra whitespace.

## Project structure

```text
.
├── Backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── sentiment_model.pkl
│   └── tfidf_vectorizer.pkl
└── Frontend/
    ├── index.html
    ├── script.js
    └── style.css
```

The model and vectorizer files are loaded when the API starts. Keep both files
in `Backend/` and run the API with `Backend/` as the working directory.

## Requirements

- Python 3.11 or newer
- A modern web browser

## Run locally

### 1. Install backend dependencies

From the repository root, run these commands in PowerShell:

```powershell
Set-Location Backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If PowerShell blocks virtual environment activation, use the Python executable
directly instead:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 2. Start the API

From `Backend/`, with the virtual environment active, run:

```powershell
python app.py
```

The API listens on `http://127.0.0.1:5000`. Its root endpoint can be used to
check that it is running:

```text
GET http://127.0.0.1:5000/
```

### 3. Start the web interface

In a separate terminal, from the repository root, run:

```powershell
python -m http.server 8000 --directory Frontend
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in a browser. The interface
sends requests to `http://127.0.0.1:5000`; update `API_URL` in
`Frontend/script.js` if the API is hosted at a different address.

## API reference

### `POST /predict`

Submit JSON containing a non-empty `text` value:

```json
{
  "text": "The service was excellent and I would gladly return."
}
```

Example response:

```json
{
  "text": "The service was excellent and I would gladly return.",
  "sentiment": "positive",
  "confidence": 98.42,
  "probabilities": {
    "positive": 98.42,
    "negative": 1.58
  }
}
```

`sentiment` is either `positive` or `negative`. `confidence` and the two
probabilities are percentages. Invalid or empty input returns an error response
with HTTP status `400`.

Example request with cURL:

```powershell
curl.exe -X POST http://127.0.0.1:5000/predict `
  -H "Content-Type: application/json" `
  -d '{"text":"The service was excellent."}'
```

## Notes

- The application performs inference using the included model artifacts; this
  repository does not include a model-training workflow.
- Only load `.pkl` model files from trusted sources. Loading a modified or
  untrusted pickle file can execute arbitrary code.
- The Flask development server is intended for local development. Use a
  production WSGI server, such as Gunicorn, when deploying the API.
