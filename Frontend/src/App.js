import React, { useState, useEffect } from "react";
import "./App.css";
import SignIn from "./signIn";
import SignUp from "./signUp";
import ProductList from "./Components/ProductList";
import SellProduct from "./SellProduct"; // Import the SellProduct component
import Cart from "./Cart"; // Import the Cart component
import Shipping from "./Shipping";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [cart, setCart] = useState([]); // Cart state

    // Sync cart state with localStorage on initial load
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Update token in localStorage and state
    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>My Shop</h1>
                    <nav className="App-nav">
                        <Link to="/">Home</Link>
                        {token && <Link to="/sell">Sell Product</Link>}
                        <Link to="/cart">Cart ({cart.length})</Link> {/* Cart link with dynamic count */}
                        {token ? (
                            <button onClick={handleLogout}>Log Out</button>
                        ) : (
                            <>
                                <Link to="/signin">Sign In</Link>
                                <Link to="/signup">Sign Up</Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="App-main">
                    <Routes>
                        {/* Redirect to home if logged in */}
                        <Route
                            path="/"
                            element={
                                token ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <SignIn onLogin={handleLogin} />
                                )
                            }
                        />

                        {/* Sign Up Page */}
                        <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />

                        {/* Home Page */}
                        <Route
                            path="/home"
                            element={token ? <ProductList setCart={setCart} /> : <Navigate to="/" />}
                        />

                        {/* Sell Product Page */}
                        <Route
                            path="/sell"
                            element={token ? <SellProduct /> : <Navigate to="/" />}
                        />

                        {/* Cart Page */}
                        <Route
                            path="/cart"
                            element={token ? <Cart cart={cart} setCart={setCart} /> : <Navigate to="/" />}
                        />

                        {/* Shipping Page */}
                        <Route
                            path="/shipping"
                            element={token ? <Shipping cart={cart} /> : <Navigate to="/" />}
                        />

                        {/* Redirect to home for unknown routes */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
