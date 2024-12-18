import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const SellProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);

        formData.append("images", images[0]);

        try {
            const token = localStorage.getItem("token"); // Retrieve token
            console.log("Token: ", token)
            await axios.post("http://localhost:5000/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    //"Authorization": `Bearer ${token}`, // Add Authorization header
                },
            });
            setMessage("Product added successfully!");
            setName("");
            setPrice("");
            setStock("");
            setImages([]);
        } catch (error) {
            console.error("Error details:", error);
            setMessage("Error adding product: " + (error.response?.data.message || error.message));
        }
    };

    return (
        <div className="sell-product-container">
            <h2>Sell a Product</h2>
            <form onSubmit={handleSubmit}>
                <label>Product Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    required
                />

                <label>Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    required
                />

                <label>Stock</label>
                <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Enter stock quantity"
                    required
                />

                <label>Images (Max 3)</label>
                <input type="file" multiple onChange={handleFileChange} accept="image/*" />

                <button type="submit">Add Product</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default SellProduct;
