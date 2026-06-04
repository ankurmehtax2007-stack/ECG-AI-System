from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import (
    create_access_token
)

auth_bp = Blueprint(
    "auth_bp",
    __name__
)

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json()

    username = data["username"]
    password = data["password"]

    if (
        username == "doctor"
        and
        password == "doctor123"
    ):

        token = create_access_token(
            identity=username
        )

        return jsonify({

            "token":
            token
        })

    return jsonify({

        "error":
        "Invalid Credentials"

    }),401