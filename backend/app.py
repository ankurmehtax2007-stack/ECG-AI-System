from flask import Flask
from flask import request
from flask import jsonify
import json

from database.db import db
from flask_cors import CORS

import os
from routes.patient_routes import patient_bp
from routes.prediction_routes import prediction_bp
from predictor import predict_ecg
from routes.dashboard_routes import dashboard_bp
from routes.report_routes import report_bp

from flask_jwt_extended import JWTManager

from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app)

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = os.getenv(
    "DATABASE_URL"
)

app.config[
    "SQLALCHEMY_TRACK_MODIFICATIONS"
] = False

app.config[
    "JWT_SECRET_KEY"
] = os.getenv(
    "JWT_SECRET_KEY"
)

jwt = JWTManager(app)

app.register_blueprint(
    dashboard_bp
)

db.init_app(app)

app.register_blueprint(
    patient_bp
)

app.register_blueprint(
    prediction_bp
)

app.register_blueprint(
    report_bp
)

@app.route("/")
def home():

    return jsonify({
        "status":"running"
    })

with app.app_context():

    db.create_all()

@app.route("/metadata")
def metadata():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    metadata_path = os.path.join(base_dir, "configs", "metadata.json")
    with open(metadata_path) as f:
        metadata = json.load(f)

    return jsonify(metadata)

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )