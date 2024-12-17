//import React, { useEffect, useState } from "react";
//import { getProducts, createProduct } from "../api"; // Function to fetch and create products from API
//import Slider from "react-slick"; // For the image carousel
//import "./ProductList.css"; // Add custom styles for the page
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
//
//
//const ProductList = () => {
//    const [products, setProducts] = useState([]);
//    const [searchQuery, setSearchQuery] = useState("");
//    const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", images: [] });
//    const [message, setMessage] = useState("");
//    const token = localStorage.getItem("token");
//
//    useEffect(() => {
//        const fetchProducts = async () => {
//            const data = await getProducts(); // Fetch products from API
//            setProducts(data);
//        };
//        fetchProducts();
//    }, []);
//
//    // Handle creating a new product
//    const handleCreateProduct = async (e) => {
//        e.preventDefault();
//
//        const formData = new FormData();
//        formData.append("name", newProduct.name);
//        formData.append("price", newProduct.price);
//        formData.append("stock", newProduct.stock);
//
//        // Append images to FormData
//        for (let i = 0; i < newProduct.images.length; i++) {
//            formData.append("images", newProduct.images[i]);
//        }
//
//        try {
//            await createProduct(formData);
//            setMessage("Product created successfully!");
//            setNewProduct({ name: "", price: "", stock: "", images: [] });
//        } catch (error) {
//            setMessage("Error creating product.");
//        }
//    };
//
//    // Handle file input change
//    const handleFileChange = (e) => {
//        setNewProduct({ ...newProduct, images: e.target.files });
//    };
//
//    // Filter products based on the search query
//    const filteredProducts = products.filter((product) =>
//        product.name.toLowerCase().includes(searchQuery.toLowerCase())
//    );
//
//    // Carousel settings
//    const carouselSettings = {
//        dots: true,
//        infinite: true,
//        speed: 500,
//        slidesToShow: 1,
//        slidesToScroll: 1,
//    };
//
//    return (
//        <div className="product-container">
//            <h2>Our Products</h2>
//            <input
//                type="text"
//                placeholder="Search for products..."
//                value={searchQuery}
//                onChange={(e) => setSearchQuery(e.target.value)}
//                className="search-bar"
//            />
//            <div className="product-grid">
//                {filteredProducts.map((product) => (
//                    <div key={product.id} className="product-card">
//                        <h3>{product.name}</h3>
//                        <p>Price: ${product.price}</p>
//                        <p>Stock: {product.stock}</p>
//                        {product.images && (
//                            <div className="carousel-container">
//                                <Slider {...carouselSettings}>
//                                    {product.images.map((image, index) => (
//                                        <div key={index}>
//                                            <img src={`http://localhost:5000/${image}`} alt={`Product Image ${index + 1}`} />
//                                        </div>
//                                    ))}
//                                </Slider>
//                            </div>
//                        )}
//                        {token && (
//                            <button className="buy-button">Buy</button>
//                        )}
//                    </div>
//                ))}
//            </div>
//
//            {token && (
//                <div className="sell-product-container">
//                    <h3>Sell a Product</h3>
//                    <form onSubmit={handleCreateProduct}>
//                        <div>
//                            <label>Name</label>
//                            <input
//                                type="text"
//                                value={newProduct.name}
//                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                                required
//                            />
//                        </div>
//                        <div>
//                            <label>Price</label>
//                            <input
//                                type="number"
//                                value={newProduct.price}
//                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//                                required
//                            />
//                        </div>
//                        <div>
//                            <label>Stock</label>
//                            <input
//                                type="number"
//                                value={newProduct.stock}
//                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
//                                required
//                            />
//                        </div>
//                        <div>
//                            <label>Images (Max 3)</label>
//                            <input
//                                type="file"
//                                multiple
//                                accept="image/*"
//                                onChange={handleFileChange}
//                                max="3"
//                            />
//                        </div>
//                        <button type="submit">Create Product</button>
//                    </form>
//                    {message && <p>{message}</p>}
//                </div>
//            )}
//        </div>
//    );
//};
//
//export default ProductList;

import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h2>Available Products</h2>
            <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        {product.images && (
                            <Slider {...carouselSettings}>
                                {product.images.map((image, index) => (
                                    <div key={index}>
                                        <img
                                            src={`http://localhost:5000/${image}`}
                                            alt={`Product ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
