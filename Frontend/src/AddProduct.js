import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
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

        // Append files to FormData
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await axios.post("http://localhost:5000/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Product added successfully!");
        } catch (error) {
            setMessage("Error adding product: " + error.response?.data.message || error.message);
        }
    };

    return (
        <div>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
                <input type="file" multiple onChange={handleFileChange} />
                <button type="submit">Add Product</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddProduct;
