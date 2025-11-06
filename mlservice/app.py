import os
import joblib
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.exceptions import BadRequest

# --- Flask Setup ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # you can restrict origins later if needed

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'vectorizer.pkl')

# --- Load Model and Vectorizer ---
print("📦 Loading ML model and vectorizer...")
try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("✅ Model and vectorizer loaded successfully.")
except FileNotFoundError:
    model, vectorizer = None, None
    print("❌ Model files not found. Please run `trainmodel.py` to generate them.")
except Exception as e:
    model, vectorizer = None, None
    print(f"❌ Error loading model/vectorizer: {e}")


# --- Text Cleaning ---
def clean_text(text: str) -> str:
    """Basic text preprocessing before vectorization."""
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# --- Routes ---
@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "ok", "message": "Fake News Detector ML API is running."})


@app.route('/predict', methods=['POST'])
def predict():
    """Predict whether text is Fake or True."""
    if not model or not vectorizer:
        return jsonify({'error': 'Model not loaded. Please train the model first.'}), 500

    try:
        # Ensure JSON format
        data = request.get_json(force=True)
        text_to_check = data.get('text', '').strip()

        if not text_to_check:
            raise BadRequest("Missing 'text' in request body.")

        cleaned_text = clean_text(text_to_check)
        processed_text = vectorizer.transform([cleaned_text])
        prediction = model.predict(processed_text)[0]

        print(f"🧠 Input: {cleaned_text[:50]}... | Prediction: {prediction}")
        return jsonify({
            'input_text': text_to_check,
            'prediction': prediction
        })

    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({'error': 'Internal server error during prediction.'}), 500


# --- Run Server ---
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    print(f"🚀 Starting Flask ML Service on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port)
