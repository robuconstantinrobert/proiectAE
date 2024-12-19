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


# @orders.route("/", methods=["POST"])
# def create_order():
#     data = request.json
#     user_id = data["user_id"]
#     product_items = data["products"]  # List of products with quantity
#
#     # Calculate total price
#     total_price = 0
#     order_items = []
#
#     for item in product_items:
#         # Get the product based on the product ID
#         product = Product.query.get_or_404(item["id"])  # Using "id" based on the product model
#
#         # Check if the requested quantity is available
#         if product.stock < item["quantity"]:
#             return jsonify({"message": f"Not enough stock for {product.name}"}), 400
#
#         # Calculate the total price for this product
#         total_price += product.price * item["quantity"]
#
#         # Create the order item for this product
#         order_items.append(OrderItem(product_id=product.id, quantity=item["quantity"]))
#
#         # Reduce the stock of the product
#         product.stock -= item["quantity"]
#
#     # Create a new order with the user ID, total price, and order items
#     new_order = Order(user_id=user_id, total_price=total_price, products=order_items)
#
#     # Save the new order to the database
#     db.session.add(new_order)
#     db.session.commit()
#
#     # Return a response with the order ID and total price
#     return jsonify({
#         "message": "Order created",
#         "order_id": new_order.id,
#         "total_price": total_price
#     }), 201


@orders.route("/", methods=["POST"])
def create_order():
    data = request.json
    user_id = data["user_id"]
    product_items = data["products"]  # List of products with quantity

    # Calculate total price
    total_price = 0
    order_items = []
    for item in product_items:
        product = Product.query.get_or_404(item["id"])  # Use 'id' to fetch product
        total_price += product.price * item["quantity"]

        # Check stock availability
        if product.stock < item["quantity"]:
            return jsonify({"message": f"Not enough stock for {product.name}"}), 400

        # Create OrderItem for each product
        order_item = OrderItem(product_id=item["id"], quantity=item["quantity"])
        order_items.append(order_item)

        # Reduce stock
        product.stock -= item["quantity"]

    # Create new order and save to DB
    new_order = Order(user_id=user_id, total_price=total_price)
    db.session.add(new_order)

    # Add the order items to the order
    new_order.order_items = order_items

    db.session.commit()

    # Return the order ID and total price
    return jsonify({"message": "Order created", "order_id": new_order.id, "total_price": total_price}), 201



@orders.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)

    # Restore stock for products in the order
    for item in order.order_items:  # Make sure to access the order_items
        product = Product.query.get_or_404(item.product_id)
        product.stock += item.quantity

    # Delete the order items first to maintain referential integrity
    for item in order.order_items:
        db.session.delete(item)

    # Now delete the order itself
    db.session.delete(order)
    db.session.commit()

    return jsonify({"message": "Order deleted"}), 200




def order_method():
    return None