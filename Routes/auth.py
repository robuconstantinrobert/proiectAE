from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from Models import user
from database import db

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_password = generate_password_hash(data["password"], method="sha256")
    new_user = User(name=data["name"], email=data["email"], hashed_password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.hashed_password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401
    access_token = create_access_token(identity={"id": user.id, "email": user.email})
    return jsonify({"access_token": access_token}), 200
