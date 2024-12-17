import React from "react";

const Cart = ({ cartItems, removeFromCart }) => {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}
                    <h3>Total Price: ${totalPrice}</h3>
                </div>
            )}
        </div>
    );
};

export default Cart;
