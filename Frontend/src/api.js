import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Helper function to get the token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = async () => {
    const token = localStorage.getItem("token");
    console.log(token)
    try {
        const response = await axios.get(`${API_BASE_URL}/products`, {
            //headers: getAuthHeaders(),
            //Authorization: `Bearer ${token}`,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};


export const createProduct = async (product) => {
    try {
        await axios.post(`${API_BASE_URL}/products`, product, {
            //headers: getAuthHeaders(),
        });
    } catch (error) {
        console.error("Error creating product:", error);
    }
};

export const getOrders = async () => {
    const response = await axios.get(`${API_BASE_URL}/orders`, {
        //headers: getAuthHeaders(),
    });
    return response.data;
};

export const createOrder = async (order) => {
    try{
        await axios.post(`${API_BASE_URL}/orders`, order, {
        //headers: getAuthHeaders(),
        });
    }catch (error) {
        console.error("Error creating the order: ". error)
    }

};


export const updateProductStock = async (productId, newStock) => {
    try {
        const response = await fetch(`http://localhost:5000/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stock: newStock }),
        });
        if (!response.ok) {
            throw new Error("Failed to update stock");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error;
    }
};

