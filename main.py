from flask import Flask
from flask_jwt_extended import JWTManager
from database import init_db
from Routes.auth import auth

app = Flask(__name__)

# Configurare aplicație
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user:password@localhost/ecommerce_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key"

# Inițializare baze de date și JWT
init_db(app)
jwt = JWTManager(app)

# Înregistrare rute
app.register_blueprint(auth, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True)
