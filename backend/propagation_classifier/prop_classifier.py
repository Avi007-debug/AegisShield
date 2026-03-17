from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from backend.graph.engine import generate_training_data, extract_features
# Use centralized path config
from backend.config import PROPAGATION_MODEL_PATH
import joblib
import os
import pandas as pd

# Define model path relative to this file
# MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../models'))
# MODEL_PATH = os.path.join(MODEL_DIR, 'propagation_classifier.pkl')
MODEL_PATH = PROPAGATION_MODEL_PATH

# Load model at import time
if os.path.exists(MODEL_PATH):
    prop_clf = joblib.load(MODEL_PATH)
else:
    prop_clf = None  # Will be trained in __main__

def classify_propagation_pattern(timeline: list) -> dict:
    features = extract_features(timeline)
    
    # Debug: print extracted features
    print(f"\n=== TEST TIMELINE ===")
    print(f"Input: {timeline}")
    print(f"Extracted features: {features}")
    
    # Create DataFrame with proper column names to match training
    feature_df = pd.DataFrame({
        'velocity_ratio': [features['velocity_ratio']],
        'simultaneous_activation_count': [features['simultaneous_activation_count']],
        'activation_variance': [features['activation_variance']],
        'depth_width_ratio': [features['depth_width_ratio']],
        'gini_coefficient': [features['gini_coefficient']],
        'cascade_depth': [features['cascade_depth']]
    })
    
    prediction = prop_clf.predict(feature_df)[0]
    proba = prop_clf.predict_proba(feature_df)[0]
    
    # proba is [prob_organic, prob_coordinated] if classes are [0, 1]
    # Check classes_ attribute if possible, but assuming standard sklearn behavior for binary 0/1
    coordination_prob = proba[1]
    
    print(f"Prediction: {prediction}, Coordinated Prob: {coordination_prob}")
    print(f"===================\n")
    
    return {
        'verdict': 'coordinated' if prediction == 1 else 'organic',
        'confidence': round(float(max(proba)), 4),
        'coordination_prob': round(float(coordination_prob), 4),
        'features': features
    }
if __name__ == "__main__":
    # Create models directory if it doesn't exist
    MODEL_DIR = os.path.dirname(MODEL_PATH)
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    df = generate_training_data(500)
    print(f"Sample features:\n{df.head()}")
    print(f"Feature variance:\n{df.var()}")
    X = df[['velocity_ratio','simultaneous_activation_count','activation_variance','depth_width_ratio','gini_coefficient','cascade_depth']]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,           # Limit tree depth
        min_samples_split=10,  # Require more samples per split
        min_samples_leaf=5,    # Require more leaf samples
        random_state=42
    )
    clf.fit(X_train, y_train)

    print(classification_report(y_test, y_pred=clf.predict(X_test)))
    print(f"\nTrain accuracy: {clf.score(X_train, y_train):.4f}")
    print(f"Test accuracy: {clf.score(X_test, y_test):.4f}")  # Should be lower than train
    joblib.dump(clf, MODEL_PATH)