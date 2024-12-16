import './App.css';
import React from "react";
import ProductList from "./Components/ProductList";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";

const App = () => {
    return (
        <div>
            <h1>Authentication</h1>
            <SignUp />
            <SignIn />
        </div>
    );
};

export default App;
