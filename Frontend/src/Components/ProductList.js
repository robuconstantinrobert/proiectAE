//import React, { useEffect, useState } from "react";
//import { getProducts, updateProductStock } from "../api"; // Assuming you have an API to update stock
//import { useNavigate } from "react-router-dom"; // for navigation
//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
//import "./ProductList.css";
//
//const ProductList = () => {
//    const [products, setProducts] = useState([]);
//    const [searchQuery, setSearchQuery] = useState("");
//    const [cart, setCart] = useState([]); // State for cart
//    const history = useNavigate(); // For navigation to cart page
//
//    // Fetch products and cart content
//    useEffect(() => {
//        const fetchProducts = async () => {
//            try {
//                const data = await getProducts();
//                setProducts(data);
//            } catch (error) {
//                console.error("Error fetching products:", error);
//            }
//        };
//
//        // Load cart content from localStorage
//        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//        setCart(storedCart);
//
//        fetchProducts();
//    }, []);
//
//    const filteredProducts = products.filter((product) =>
//        product.name.toLowerCase().includes(searchQuery.toLowerCase())
//    );
//
//    const handleBuyClick = async (productId) => {
//        // Find the product that was clicked
//        const productToAdd = products.find((product) => product.id === productId);
//
//        // Check if stock is available
//        if (productToAdd.stock > 0) {
//            // Decrease the stock locally
//            const updatedProduct = { ...productToAdd, stock: productToAdd.stock - 1 };
//
//            // Update the product in the state
//            const updatedProducts = products.map((product) =>
//                product.id === productId ? updatedProduct : product
//            );
//            setProducts(updatedProducts);
//
//            // Update the stock in the backend (make sure to implement this API)
//            try {
//                await updateProductStock(productId, updatedProduct.stock); // Assuming this API exists
//            } catch (error) {
//                console.error("Error updating stock:", error);
//            }
//
//            // Add the product to the cart
//            const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
//            cartFromStorage.push(productToAdd);
//            localStorage.setItem("cart", JSON.stringify(cartFromStorage));
//            setCart(cartFromStorage); // Update the cart state
//        } else {
//            alert("Sorry, this product is out of stock.");
//        }
//    };
//
//    const handleGoToCart = () => {
//        history.push("/cart"); // Navigate to the cart page
//    };
//
//    const getCartItemCount = () => {
//        return cart.length; // Return the number of items in the cart
//    };
//
//    return (
//        <div>
//            <h2>Available Products</h2>
//            <input
//                type="text"
//                placeholder="Search for products..."
//                value={searchQuery}
//                onChange={(e) => setSearchQuery(e.target.value)}
//                className="search-bar"
//            />
//            <div className="product-list">
//                {filteredProducts.map((product) => (
//                    <div key={product.id} className="product-box">
//                        <img
//                            src={`http://localhost:5000/${product.images?.[0]}`}
//                            alt={product.name}
//                            className="product-image"
//                        />
//                        <div className="product-info">
//                            <h3 className="product-name">{product.name}</h3>
//                            <p className="product-price">Price: ${product.price}</p>
//                            <p className="product-stock">Stock: {product.stock}</p>
//                            <button
//                                className="buy-button"
//                                onClick={() => handleBuyClick(product.id)}
//                            >
//                                Buy
//                            </button>
//                        </div>
//                    </div>
//                ))}
//            </div>
//            <button onClick={handleGoToCart} className="cart-button">
//                Go to Cart ({getCartItemCount()})
//            </button>
//        </div>
//    );
//};
//
//export default ProductList;


import React, { useEffect, useState } from "react";
import { getProducts, updateProductStock } from "../api"; // Assuming you have an API to update stock
import { useNavigate } from "react-router-dom"; // for navigation
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]); // State for cart
    const navigate = useNavigate(); // For navigation to cart page

    // Fetch products and cart content
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        // Load cart content from localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBuyClick = async (productId) => {
        // Find the product that was clicked
        const productToAdd = products.find((product) => product.id === productId);

        // Check if stock is available
        if (productToAdd.stock > 0) {
            // Decrease the stock locally
            const updatedProduct = { ...productToAdd, stock: productToAdd.stock - 1 };

            // Update the product in the state
            const updatedProducts = products.map((product) =>
                product.id === productId ? updatedProduct : product
            );
            setProducts(updatedProducts);

            // Update the stock in the backend (make sure to implement this API)
            try {
                await updateProductStock(productId, updatedProduct.stock); // Assuming this API exists
            } catch (error) {
                console.error("Error updating stock:", error);
            }

            // Add the product to the cart
            const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
            cartFromStorage.push(productToAdd);
            localStorage.setItem("cart", JSON.stringify(cartFromStorage));
            setCart(cartFromStorage); // Update the cart state
        } else {
            alert("Sorry, this product is out of stock.");
        }
    };

    const handleGoToCart = () => {
        navigate("/cart"); // Navigate to the cart page
    };

    const getCartItemCount = () => {
        return cart.length; // Return the number of items in the cart
    };

    return (
        <div>
            <h2>Available Products</h2>
            <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
            />
            <div className="product-list">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-box">
                        <img
                            src={`http://localhost:5000/${product.images?.[0]}`}
                            alt={product.name}
                            className="product-image"
                        />
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">Price: ${product.price}</p>
                            <p className="product-stock">Stock: {product.stock}</p>
                            <button
                                className="buy-button"
                                onClick={() => handleBuyClick(product.id)}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleGoToCart} className="cart-button">
                Go to Cart ({getCartItemCount()})
            </button>
        </div>
    );
};

export default ProductList;
