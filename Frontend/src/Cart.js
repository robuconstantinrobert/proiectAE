import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Cart.css'; // If using a separate CSS file for the cart

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [currency, setCurrency] = useState("USD"); // Default currency
    const [exchangeRate, setExchangeRate] = useState(1); // Default exchange rate
    const [totalPrice, setTotalPrice] = useState(0); // To hold the total price in selected currency
    const history = useNavigate();

    // Fetch exchange rate when currency changes
    useEffect(() => {
        const fetchExchangeRate = async () => {
            const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
            const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`; // Example URL for ExchangeRate-API
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.result === "success") {
                    setExchangeRate(data.conversion_rates[currency]);
                } else {
                    console.error("Failed to fetch exchange rates");
                }
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
            }
        };

        fetchExchangeRate();
    }, [currency]);

    // Calculate the total price in the selected currency
    useEffect(() => {
        const total = cart.reduce((acc, product) => acc + product.price, 0);
        setTotalPrice(total * exchangeRate); // Convert the total price to the selected currency
    }, [cart, exchangeRate]);

    const handleCheckout = () => {
        const orderData = {
            user_id: 1, // This should be dynamically set based on logged-in user
            products: cart.map((product) => ({
                product_id: product.id,
                quantity: 1,
            })),
        };

        history("/shipping");

        fetch("/api/orders", {
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
                                <p>Price: {currency} {product.price * exchangeRate}</p> {/* Display price in selected currency */}
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <p>Total: {currency} {totalPrice.toFixed(2)}</p> {/* Display total price in selected currency */}
                    </div>
                    <div className="currency-selector">
                        <label htmlFor="currency">Choose Currency:</label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                            <option value="JPY">JPY</option>
                            {/* Add more currencies as needed */}
                        </select>
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
