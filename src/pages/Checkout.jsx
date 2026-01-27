import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../redux/slices/cartSlice';
import CheckoutForm from '../components/features/checkout/CheckoutForm';
import { formatCurrency } from '../utils/formatCurrency';
import { createOrder } from '../services/api';
import '../styles/Forms.css';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const handlePlaceOrder = async (customerData) => {
        setLoading(true);
        try {
            const orderData = {
                customerName: `${customerData.firstName} ${customerData.lastName}`,
                customerEmail: customerData.email,
                shippingAddress: `${customerData.address}, ${customerData.city}, ${customerData.zip}`,
                items: items.map(item => ({
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: total,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            await createOrder(orderData);

            // Call n8n webhook for email confirmation
            const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
            if (webhookUrl) {
                try {
                    console.log('Sending order data to n8n webhook:', orderData);
                    const response = await axios.post(webhookUrl, orderData);
                    console.log('n8n Webhook Response:', response.data);
                } catch (webhookError) {
                    console.error('Error calling n8n webhook:', webhookError.message);
                    // We don't want to block the user if the webhook fails, 
                    // since the order was already created in the DB.
                }
            } else {
                console.warn('n8n webhook URL is not defined in environment variables.');
            }

            dispatch(clearCart());
            setOrderPlaced(true);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('There was an error placing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="form-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2 className="form-title" style={{ color: 'green' }}>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order number is #{(Math.random() * 1000000).toFixed(0)}.</p>
                <button className="submit-btn" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>Return Home</button>
            </div>
        );
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-grid">
            <div className="checkout-section">
                <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Checkout</h2>
                <CheckoutForm onSubmit={handlePlaceOrder} />
            </div>

            <div className="order-summary-section">
                <div className="form-container" style={{ margin: 0 }}>
                    <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
                    {items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span>{item.title} (x{item.quantity})</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--gray-300)', margin: '1rem 0' }}></div>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="summary-row total-row">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
