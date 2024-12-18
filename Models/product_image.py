from database import db
from sqlalchemy import LargeBinary

class ProductImage(db.Model):
    __tablename__ = "product_images"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    image = db.Column(LargeBinary, nullable=False)

    product = db.relationship("Product", back_populates="images")