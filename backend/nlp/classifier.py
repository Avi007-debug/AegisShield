import joblib
from backend.config import MODEL_PATH, VECTORIZER_PATH

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)


def predict(text: str):

    X = vectorizer.transform([text])

    prediction = model.predict(X)[0]

    probabilities = model.predict_proba(X)[0]

    fake_prob = float(probabilities[0])
    true_prob = float(probabilities[1])

    label = "fake" if fake_prob >= true_prob else "true"

    confidence_score = max(fake_prob, true_prob)

    if confidence_score > 0.8:
        confidence = "high"
    elif confidence_score > 0.6:
        confidence = "medium"
    else:
        confidence = "low"

    return {
        "label": label,
        "fake_probability": round(fake_prob, 4),
        "true_probability": round(true_prob, 4),
        "confidence": confidence
    }