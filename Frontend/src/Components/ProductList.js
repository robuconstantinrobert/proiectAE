import React, { useEffect, useState } from "react";
import { getProducts, updateProductStock } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductList.css";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBuyClick = async (productId) => {
        const productToAdd = products.find((product) => product.id === productId);

        if (productToAdd.stock > 0) {
            const updatedProduct = { ...productToAdd, stock: productToAdd.stock - 1 };

            const updatedProducts = products.map((product) =>
                product.id === productId ? updatedProduct : product
            );
            setProducts(updatedProducts);

            try {
                await updateProductStock(productId, updatedProduct.stock);
            } catch (error) {
                console.error("Error updating stock:", error);
            }


            const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];
            cartFromStorage.push(productToAdd);
            localStorage.setItem("cart", JSON.stringify(cartFromStorage));
            setCart(cartFromStorage);


            const orderData = {
                user_id: 4,
                products: [{ id: productId, quantity: 1 }],
            };

            console.log(orderData)

            try {
                const token = localStorage.getItem("token");
                console.log("Token: ", token);

                const response = await axios.post("http://localhost:5000/orders/", orderData, {
                    headers: {
                        "Content-Type": "application/json",
                        //"Authorization": `Bearer ${token}`,
                    },
                });

                const orderId = response.data.order_id;
                localStorage.setItem("orderId", orderId);

//                if (response.status === 200) {
//                    alert(`Order created! Order ID: ${response.data.order_id}`);
//                } else {
//                    console.error("Response error: ", response);
//                    alert("Error creating order: " + response.data.message || "Unknown error");
//                }
            } catch (error) {
                console.error("Error creating order:", error.response || error.message);
                //alert("There was an error creating the order. Please try again.");
            }
        } else {
            alert("Sorry, this product is out of stock.");
        }
    };

    const handleGoToCart = () => {
        navigate("/cart");
    };

    const getCartItemCount = () => {
        return cart.length;
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
