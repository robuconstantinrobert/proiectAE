import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const getProducts = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data;
};

export const createProduct = async (product) => {
    await axios.post(`${API_BASE_URL}/products/`, product);
};

export const getOrders = async () => {
    const response = await axios.get(`${API_BASE_URL}/orders/`);
    return response.data;
};

export const createOrder = async (order) => {
    await axios.post(`${API_BASE_URL}/orders/`, order);
};
