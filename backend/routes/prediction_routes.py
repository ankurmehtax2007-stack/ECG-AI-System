import os
import json
from flask import Blueprint
from flask import request
from flask import jsonify
from flask import Response

from predictor import predict_ecg
from gradcam import generate_gradcam

from database.db import db
from database.models import Prediction


prediction_bp = Blueprint(
    "prediction_bp",
    __name__
)

@prediction_bp.route(
    "/predict",
    methods=["POST"]
)
def predict():

    data = request.get_json()

    patient_id = data["patient_id"]

    signal = data["signal"]

    if len(signal) != 187:

        return jsonify({

            "error":
            "Signal must contain 187 values"

        }),400

    result = predict_ecg(signal)

    prediction = Prediction(

        patient_id=patient_id,

        predicted_class=result["label"],

        predicted_class_id=result["class_id"],

        confidence=result["confidence"],

        risk_level=result["risk_level"],

        signal_data=json.dumps(signal)
    )

    db.session.add(
        prediction
    )

    db.session.commit()

    result["id"] = prediction.id

    return jsonify(result)


@prediction_bp.route(
    "/history/<int:patient_id>",
    methods=["GET"]
)
def get_history(patient_id):

    predictions = Prediction.query.filter_by(

        patient_id=patient_id

    ).order_by(Prediction.created_at.desc()).all()

    result = []

    for p in predictions:

        item = {

            "id": p.id,

            "prediction":
            p.predicted_class,

            "class_id":
            p.predicted_class_id,

            "confidence":
            p.confidence,

            "risk":
            p.risk_level,

            "date":
            p.created_at
        }

        # Include signal data if stored
        if p.signal_data:
            item["signal"] = json.loads(p.signal_data)

        result.append(item)

    return jsonify(result)


@prediction_bp.route(
    "/explain/<int:prediction_id>",
    methods=["GET"]
)
def get_explainability(prediction_id):
    """Generate a real Grad-CAM visualization for a specific prediction."""
    prediction = Prediction.query.get(prediction_id)

    if not prediction:
        return jsonify({"error": "Prediction not found"}), 404

    if not prediction.signal_data:
        return jsonify({"error": "No signal data stored for this prediction"}), 404

    signal = json.loads(prediction.signal_data)
    class_id = prediction.predicted_class_id

    try:
        image_bytes = generate_gradcam(signal, class_id)
        return Response(image_bytes, mimetype="image/png")
    except Exception as e:
        print(f"Grad-CAM generation error: {e}")
        return jsonify({"error": f"Grad-CAM generation failed: {str(e)}"}), 500


@prediction_bp.route(
    "/predictions/<int:prediction_id>",
    methods=["DELETE"]
)
def delete_prediction(prediction_id):
    """Delete a specific prediction record."""
    prediction = Prediction.query.get(prediction_id)
    if not prediction:
        return jsonify({"error": "Prediction record not found"}), 404

    db.session.delete(prediction)
    db.session.commit()
    return jsonify({"message": "Prediction record deleted successfully"})


@prediction_bp.route(
    "/patients/<int:patient_id>/history",
    methods=["DELETE"]
)
def clear_patient_history(patient_id):
    """Delete all prediction records for a specific patient."""
    Prediction.query.filter_by(patient_id=patient_id).delete()
    db.session.commit()
    return jsonify({"message": "Patient prediction history cleared successfully"})


@prediction_bp.route(
    "/explain/<int:prediction_id>/metrics",
    methods=["GET"]
)
def get_explainability_metrics_route(prediction_id):
    """Generate and return clinical explainability metrics for a specific prediction."""
    prediction = Prediction.query.get(prediction_id)
    if not prediction:
        return jsonify({"error": "Prediction not found"}), 404

    if not prediction.signal_data:
        return jsonify({"error": "No signal data stored for this prediction"}), 404

    signal = json.loads(prediction.signal_data)
    class_id = prediction.predicted_class_id
    label = prediction.predicted_class

    try:
        from gradcam import get_explainability_metrics
        metrics = get_explainability_metrics(signal, class_id, label)
        return jsonify(metrics)
    except Exception as e:
        print(f"Metrics generation error: {e}")
        return jsonify({"error": f"Failed to generate explainability metrics: {str(e)}"}), 500