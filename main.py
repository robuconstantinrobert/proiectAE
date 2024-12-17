from flask import Flask
from flask_jwt_extended import JWTManager
from database import init_db
from Routes.auth import auth
from Routes.product import products
from Routes.order import orders
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], allow_headers=["Authorization", "Content-Type"])


# Configurare aplicație
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Robert44!!@localhost/ecommerce_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your-secret-key"

# Inițializare baze de date și JWT
init_db(app)
jwt = JWTManager(app)

# Înregistrare rute
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(products, url_prefix="/products")
app.register_blueprint(orders, url_prefix="/orders")


if __name__ == "__main__":
    app.run(debug=True)
