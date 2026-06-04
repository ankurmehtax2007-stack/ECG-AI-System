from flask import Blueprint
from flask import jsonify
from flask import Response

from database.models import Patient
from database.models import Prediction
from reports.generate_report import generate_clinical_html_report

report_bp = Blueprint(
    "report_bp",
    __name__
)

@report_bp.route(
    "/reports/<int:prediction_id>",
    methods=["GET"]
)
def get_report(prediction_id):
    prediction = Prediction.query.get(prediction_id)
    if not prediction:
        return jsonify({"error": "Prediction not found"}), 404

    patient = Patient.query.get(prediction.patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    html_content = generate_clinical_html_report(patient, prediction)
    
    return Response(html_content, mimetype="text/html")
