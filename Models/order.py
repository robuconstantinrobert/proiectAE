from database import db

class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship('OrderItem', back_populates='order', cascade="all, delete-orphan")

    def __init__(self, user_id, total_price):
        self.user_id = user_id
        self.total_price = total_price