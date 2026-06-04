import json
import numpy as np

import os
from tensorflow.keras.models import load_model


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "ecg_arrhythmia_cnn.keras")
CLASS_MAPPING_PATH = os.path.join(BASE_DIR, "configs", "class_mapping.json")

model = load_model(MODEL_PATH)

# Warm up the model so all layers are built (required for Grad-CAM)
_dummy = np.zeros((1, 187, 1), dtype=np.float32)
model.predict(_dummy, verbose=0)
print("[Predictor] Model loaded and warmed up successfully.")

with open(CLASS_MAPPING_PATH) as f:

    class_mapping = json.load(f)


risk_map = {

    "Normal Beat": "Low",

    "Supraventricular Beat": "Medium",

    "Ventricular Beat": "High",

    "Fusion Beat": "High",

    "Unknown Beat": "Medium"
}


def predict_ecg(signal):

    signal = np.array(signal)

    signal = signal.reshape(
        1,
        187,
        1
    )

    prediction = model.predict(
        signal,
        verbose=0
    )

    pred_class = int(
        np.argmax(prediction)
    )

    confidence = float(
        np.max(prediction)
    )

    label = class_mapping[
        str(pred_class)
    ]

    risk = risk_map[label]

    return {

        "class_id": pred_class,

        "label": label,

        "confidence": round(
            confidence * 100,
            2
        ),

        "risk_level": risk
    }