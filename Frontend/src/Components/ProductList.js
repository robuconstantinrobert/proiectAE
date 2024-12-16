import React, { useEffect, useState } from "react";
import { getProducts } from "../api";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price} (Stock: {product.stock})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
