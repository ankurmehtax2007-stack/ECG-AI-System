from flask import Blueprint
from flask import jsonify
from flask import request

from database.models import Patient
from database.models import Prediction

dashboard_bp = Blueprint(
    "dashboard_bp",
    __name__
)

@dashboard_bp.route(
    "/dashboard/stats",
    methods=["GET"]
)
def get_stats():
    patient_id = request.args.get('patient_id')

    if patient_id:
        total_patients = 1
        total_predictions = (
            Prediction.query.filter_by(patient_id=patient_id).count()
        )
        high_risk_cases = (
            Prediction.query.filter_by(
                patient_id=patient_id,
                risk_level="High"
            ).count()
        )
    else:
        total_patients = (
            Patient.query.count()
        )
        total_predictions = (
            Prediction.query.count()
        )
        high_risk_cases = (
            Prediction.query.filter_by(
                risk_level="High"
            ).count()
        )

    return jsonify({

        "total_patients":
        total_patients,

        "total_predictions":
        total_predictions,

        "high_risk_cases":
        high_risk_cases
    })

@dashboard_bp.route(
    "/dashboard/distribution",
    methods=["GET"]
)
def prediction_distribution():
    patient_id = request.args.get('patient_id')

    if patient_id:
        predictions = Prediction.query.filter_by(patient_id=patient_id).all()
    else:
        predictions = Prediction.query.all()

    counts = {}

    for p in predictions:

        label = p.predicted_class

        counts[label] = (
            counts.get(
                label,
                0
            ) + 1
        )

    return jsonify(counts)

@dashboard_bp.route(
    "/dashboard/recent",
    methods=["GET"]
)
def recent_predictions():
    patient_id = request.args.get('patient_id')

    if patient_id:
        recent = Prediction.query.filter_by(patient_id=patient_id)\
                                  .order_by(Prediction.created_at.desc())\
                                  .limit(10).all()
    else:
        recent = Prediction.query.order_by(
                Prediction.created_at.desc()
            ).limit(10).all()

    result = []

    for r in recent:
        patient = Patient.query.get(r.patient_id)
        item = {
            "id": r.id,

            "prediction":
            r.predicted_class,

            "class_id":
            r.predicted_class_id,

            "risk":
            r.risk_level,

            "confidence":
            r.confidence,

            "date":
            r.created_at,

            "patient_name":
            patient.name if patient else "Unknown"
        }

        # Include signal data if stored
        if r.signal_data:
            import json
            item["signal"] = json.loads(r.signal_data)

        result.append(item)

    return jsonify(result)