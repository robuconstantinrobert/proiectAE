import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [totalPrice, setTotalPrice] = useState(0);
    const history = useNavigate();

    useEffect(() => {
        const total = cart.reduce((acc, product) => acc + product.price, 0);
        setTotalPrice(total);
    }, [cart]);

    const handleCheckout = () => {
        const orderData = {
            user_id: 1,
            products: cart.map((product) => ({
                product_id: product.id,
                quantity: 1,
            })),
        };

        history("/shipping");

        fetch("http://localhost:5000/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCart([]);
                localStorage.removeItem("cart");
                history.push("/");
            })
            .catch((error) => console.error("Error during checkout:", error));
    };

    const handleClearCart = async () => {
        try {
            const orderId = localStorage.getItem("orderId");
            const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("Order deleted successfully.");
            } else {
                console.error("Error deleting order:", response);
                alert("Error deleting order.");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("There was an error deleting the order. Please try again.");
        }

        setCart([]);
        localStorage.removeItem("cart");
        localStorage.removeItem("orderId");
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cart.map((product) => (
                        <div key={product.id} className="cart-item">
                            <img
                                src={`http://localhost:5000/${product.images?.[0]}`}
                                alt={product.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <h3>{product.name}</h3>
                                <p>Price: USD {product.price}</p> {/* Display price in USD */}
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <p>Total: USD {totalPrice.toFixed(2)}</p> {/* Display total price in USD */}
                    </div>
                    <button onClick={handleCheckout} className="checkout-button">
                        Checkout
                    </button>
                    <button onClick={handleClearCart} className="clear-cart-button">
                        Clear Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
