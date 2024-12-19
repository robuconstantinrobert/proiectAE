import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css'; // If using a separate CSS file for the cart

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [totalPrice, setTotalPrice] = useState(0); // To hold the total price in USD
    const history = useNavigate();

    // Calculate the total price in USD
    useEffect(() => {
        const total = cart.reduce((acc, product) => acc + product.price, 0);
        setTotalPrice(total); // USD is the only currency used
    }, [cart]);

    const handleCheckout = () => {
        const orderData = {
            user_id: 1, // This should be dynamically set based on logged-in user
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
                setCart([]); // Clear cart after successful checkout
                localStorage.removeItem("cart"); // Clear cart from localStorage
                history.push("/"); // Redirect to homepage
            })
            .catch((error) => console.error("Error during checkout:", error));
    };

    const handleClearCart = () => {
        setCart([]); // Clear cart from state
        localStorage.removeItem("cart"); // Clear cart from localStorage
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
                                src={`http://localhost:5000/${product.images?.[0]}`} // Assuming the product has an 'images' array with a URL
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
