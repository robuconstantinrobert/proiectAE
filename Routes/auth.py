from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from Models.user import User
from database import db

auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"message": "All fields (name, email, password) are required"}), 400

    # Check if email already exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 409

    try:
        # Hash the password
        hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")

        # Create the new user
        new_user = User(name=data["name"], email=data["email"], hashed_password=hashed_password)
        db.session.add(new_user)

        # Commit the transaction to the database
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        # Rollback in case of error
        db.session.rollback()
        return jsonify({"message": "An error occurred: " + str(e)}), 500


@auth.route("/login", methods=["POST"])
def login():
    data = request.json

    # Validate input fields
    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password are required"}), 400

    try:
        user = User.query.filter_by(email=data["email"]).first()
        if not user or not check_password_hash(user.hashed_password, data["password"]):
            return jsonify({"message": "Invalid credentials"}), 401

        access_token = create_access_token(identity={"id": user.id, "email": user.email})
        return jsonify({"access_token": access_token}), 200
    except Exception as e:
        return jsonify({"message": "An error occurred: " + str(e)}), 500

