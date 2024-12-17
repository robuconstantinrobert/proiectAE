from flask import Blueprint, request, jsonify
from Models.product import Product
from database import db
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from flask_cors import cross_origin

products = Blueprint("products", __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'uploads/products'

@products.route("/", methods=["GET"])
@cross_origin(origins=["http://localhost:3000"])
@jwt_required()
def get_products():
    all_products = Product.query.all()
    result = [
        {"id": p.id, "name": p.name, "price": p.price, "stock": p.stock}
        for p in all_products
    ]
    return jsonify(result), 200

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@products.route("/", methods=["POST"])
@jwt_required()
def create_product():
    data = request.form  # This will capture 'name', 'price', 'stock'
    files = request.files.getlist("images")  # Multiple files


    if not data.get("name") or not data.get("price") or not data.get("stock"):
        return jsonify({"message": "All fields (name, price, stock) are required"}), 400

    if len(files) > 3:
        return jsonify({"message": "You can upload a maximum of 3 images"}), 400

    # Parse price and stock as numbers
    try:
        price = float(data["price"])  # Ensure price is a float
        stock = int(data["stock"])  # Ensure stock is an integer
    except ValueError:
        return jsonify({"message": "Price and stock must be numbers"}), 400

    # Save images
    image_data = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            image_binary = file.read()  # Read the image file as binary data
            image_data.append(image_binary)

    new_product = Product(
        name=data["name"],
        price=price,
        stock=stock,
        images=image_data[0]  # Store only the first image as binary data
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product created", "product_id": new_product.id}), 201



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


@products.route("/search", methods=["GET"])
@jwt_required()
def search_products():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"message": "Search query is required"}), 400

    products = Product.query.filter(Product.name.ilike(f"%{query}%")).all()
    result = [
        {"id": p.id, "name": p.name, "price": p.price, "stock": p.stock}
        for p in products
    ]
    return jsonify(result), 200
