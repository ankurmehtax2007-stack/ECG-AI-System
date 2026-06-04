from flask import Blueprint
from flask import request
from flask import jsonify

from database.db import db
from database.models import Patient, Prediction


patient_bp = Blueprint(
    "patient_bp",
    __name__
)

@patient_bp.route(
    "/patients",
    methods=["POST"]
)
def create_patient():

    data = request.get_json()

    patient = Patient(

        name=data["name"],

        age=data["age"],

        gender=data["gender"]
    )

    db.session.add(patient)

    db.session.commit()

    return jsonify({

        "message":
        "Patient Created",

        "patient_id":
        patient.id
    })

@patient_bp.route(
    "/patients",
    methods=["GET"]
)
def get_patients():

    patients = Patient.query.all()

    result = []

    for patient in patients:
        latest_pred = Prediction.query.filter_by(patient_id=patient.id)\
                                      .order_by(Prediction.created_at.desc())\
                                      .first()
        status = latest_pred.risk_level if latest_pred else "No predictions"
        condition = latest_pred.predicted_class if latest_pred else "N/A"

        result.append({

            "id": patient.id,

            "name": patient.name,

            "age": patient.age,

            "gender": patient.gender,

            "latest_status": status,

            "latest_condition": condition
        })

    return jsonify(result)

@patient_bp.route(
    "/patients/<int:id>",
    methods=["GET"]
)
def get_patient(id):

    patient = Patient.query.get(id)

    if not patient:

        return jsonify({

            "error":
            "Patient Not Found"

        }),404

    return jsonify({

        "id": patient.id,

        "name": patient.name,

        "age": patient.age,

        "gender": patient.gender
    })


@patient_bp.route(
    "/patients/<int:id>",
    methods=["DELETE"]
)
def delete_patient(id):
    """Delete a patient and all of their predictions (history)."""
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    # Manually delete all associated predictions due to FK constraint
    Prediction.query.filter_by(patient_id=id).delete()
    
    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient and their history deleted successfully"})