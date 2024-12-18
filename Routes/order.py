from flask import Blueprint, request, jsonify
from Models.order import Order
from Models.product import Product
from Models.orderItem import OrderItem
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
    product_items = data["products"]  # List of products with quantity

    # Calculate total price
    total_price = 0
    order_items = []
    for item in product_items:
        product = Product.query.get_or_404(item["product_id"])
        total_price += product.price * item["quantity"]
        order_items.append(OrderItem(product_id=item["product_id"], quantity=item["quantity"]))

        if product.stock < item["quantity"]:
            return jsonify({"message": f"Not enough stock for {product.name}"}), 400
        product.stock -= item["quantity"]

    new_order = Order(user_id=user_id, total_price=total_price, products=order_items)
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order created"}), 201



@orders.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)

    # Restore stock for products in the order
    for item in order.products:
        product = Product.query.get_or_404(item.product_id)
        product.stock += item.quantity

    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted"}), 200



def order_method():
    return None