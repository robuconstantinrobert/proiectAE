from flask import Blueprint, request, jsonify
from Models.order import Order
from Models.product import Product
from Models.user import User
from database import db

orders = Blueprint("orders", __name__)

@orders.route("/", methods=["GET"])
def get_orders():
    all_orders = Order.query.all()
    result = [
        {"id": o.id, "user_id": o.user_id, "total_price": o.total_price}
        for o in all_orders
    ]
    return jsonify(result), 200

@orders.route("/", methods=["POST"])
def create_order():
    data = request.json
    user_id = data["user_id"]
    product_ids = data["product_ids"]

    # Calcul total price
    total_price = 0
    for product_id in product_ids:
        product = Product.query.get_or_404(product_id)
        total_price += product.price

    new_order = Order(user_id=user_id, total_price=total_price)
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order created"}), 201

@orders.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted"}), 200


def order_method():
    return None