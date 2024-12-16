from flask import Blueprint, request, jsonify
from Models.product import Product
from database import db

products = Blueprint("products", __name__)

@products.route("/", methods=["GET"])
def get_products():
    all_products = Product.query.all()
    result = [
        {"id": p.id, "name": p.name, "price": p.price, "stock": p.stock}
        for p in all_products
    ]
    return jsonify(result), 200

@products.route("/", methods=["POST"])
def create_product():
    data = request.json
    new_product = Product(name=data["name"], price=data["price"], stock=data["stock"])
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product created"}), 201

@products.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    product = Product.query.get_or_404(product_id)
    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    db.session.commit()
    return jsonify({"message": "Product updated"}), 200

@products.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200
