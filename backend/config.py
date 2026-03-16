from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = ROOT_DIR / "backend" / "models" / "misinformation_model.pkl"
VECTORIZER_PATH = ROOT_DIR / "backend" / "models" / "tfidf_vectorizer.pkl"
