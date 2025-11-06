import os
import re
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# -------------------------------
# Configurations
# -------------------------------
TEXT_COLUMN_NAME = 'text'
FAKE_CSV = "Fake (2).csv"
REAL_CSV = "True (2).csv"
MODEL_FILE = "model.pkl"
VECTORIZER_FILE = "vectorizer.pkl"

# -------------------------------
# Helper Functions
# -------------------------------
def clean_text(text: str) -> str:
    """Clean and normalize input text."""
    text = str(text).lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def load_data(fake_path: str, real_path: str) -> pd.DataFrame:
    """Load and label datasets."""
    if not os.path.exists(fake_path) or not os.path.exists(real_path):
        raise FileNotFoundError("Missing Fake or True CSV files.")
    fake_df = pd.read_csv(fake_path)
    real_df = pd.read_csv(real_path)
    fake_df["label"] = "FAKE"
    real_df["label"] = "REAL"
    return pd.concat([fake_df, real_df], ignore_index=True)


def train_model(df: pd.DataFrame):
    """Train model and return classifier and vectorizer."""
    df = df.dropna(subset=[TEXT_COLUMN_NAME])
    df[TEXT_COLUMN_NAME] = df[TEXT_COLUMN_NAME].apply(clean_text)

    X = df[TEXT_COLUMN_NAME]
    y = df["label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"🧠 Training data: {len(X_train)} samples | Test data: {len(X_test)} samples")

    vectorizer = TfidfVectorizer(stop_words="english", max_df=0.7)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    classifier = PassiveAggressiveClassifier(max_iter=50)
    classifier.fit(X_train_tfidf, y_train)

    # Evaluate
    y_pred = classifier.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
    print("Classification Report:\n", classification_report(y_test, y_pred))

    return classifier, vectorizer


def save_model(model, vectorizer, output_dir="."):
    """Save model and vectorizer as .pkl files."""
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, MODEL_FILE)
    vect_path = os.path.join(output_dir, VECTORIZER_FILE)
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vect_path)
    print(f"💾 Model saved to {model_path}")
    print(f"💾 Vectorizer saved to {vect_path}")


# -------------------------------
# Main Script
# -------------------------------
if __name__ == "__main__":
    print("🚀 Starting model training...")
    try:
        data = load_data(FAKE_CSV, REAL_CSV)
        model, vectorizer = train_model(data)
        save_model(model, vectorizer, output_dir=os.path.dirname(__file__))
        print("🎉 Training complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
