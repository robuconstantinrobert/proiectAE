//import React, { useState, useEffect } from "react";
//import "./App.css";
//import SignIn from "./signIn";
//import SignUp from "./signUp";
//import ProductList from "./Components/ProductList";
//import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//
//const App = () => {
//    const [token, setToken] = useState(localStorage.getItem("token") || "");
//
//    // Update token in localStorage and state
//    const handleLogin = (newToken) => {
//        localStorage.setItem("token", newToken);
//        setToken(newToken);
//    };
//
//    const handleLogout = () => {
//        localStorage.removeItem("token");
//        setToken("");
//    };
//
//    return (
//        <Router>
//            <div className="App">
//                <header className="App-header">
//                    <h1>Authentication</h1>
//                    <nav className="App-nav">
//                        {token ? (
//                            <button onClick={handleLogout}>Log Out</button>
//                        ) : (
//                            <>
//                                <button onClick={() => setToken("signin")}>Sign In</button>
//                                <button onClick={() => setToken("signup")}>Sign Up</button>
//                            </>
//                        )}
//                    </nav>
//                </header>
//
//                <main className="App-main">
//                    <Routes>
//                        <Route
//                            path="/"
//                            element={
//                                token ? (
//                                    <Navigate to="/home" />
//                                ) : (
//                                    <SignIn onLogin={handleLogin} />
//                                )
//                            }
//                        />
//                        <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
//                        <Route
//                            path="/home"
//                            element={token ? <ProductList /> : <Navigate to="/" />}
//                        />
//                    </Routes>
//                </main>
//            </div>
//        </Router>
//    );
//};
//
//export default App;

import React, { useState, useEffect } from "react";
import "./App.css";
import SignIn from "./signIn";
import SignUp from "./signUp";
import ProductList from "./Components/ProductList";
import SellProduct from "./SellProduct"; // Import the SellProduct component
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

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
                            element={token ? <ProductList /> : <Navigate to="/" />}
                        />

                        {/* Sell Product Page */}
                        <Route
                            path="/sell"
                            element={token ? <SellProduct /> : <Navigate to="/" />}
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
