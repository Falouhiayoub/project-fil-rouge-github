import axios from 'axios';
import { VITE_MOCKAPI_URL } from '../config/env';

const api = axios.create({
    baseURL: VITE_MOCKAPI_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getOrders = () => api.get('/orders');
export const updateOrder = (id, order) => api.put(`/orders/${id}`, order);
export const createOrder = (order) => api.post('/orders', order);

export const getReviews = (productId) => api.get(`/reviews?productId=${productId}`);
export const createReview = (review) => api.post('/reviews', review);

export default api;
