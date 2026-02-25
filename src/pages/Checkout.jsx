import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../redux/slices/cartSlice';
import CheckoutForm from '../components/features/checkout/CheckoutForm';
import { formatCurrency } from '../utils/formatCurrency';
import { createOrder } from '../services/api';
import { VITE_N8N_WEBHOOK_URL } from '../config/env';
import '../styles/Forms.css';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const VALID_COUPONS = {
        'FASHION20': { type: 'percentage', value: 20 },
        'WELCOME10': { type: 'percentage', value: 10 },
        'SAVE5': { type: 'fixed', value: 5 }
    };

    const handleApplyCoupon = () => {
        const code = couponCode.toUpperCase().trim();
        if (VALID_COUPONS[code]) {
            const cp = VALID_COUPONS[code];
            setAppliedCoupon({ code, ...cp });
            setCouponError('');
        } else {
            setCouponError('Invalid coupon code');
            setAppliedCoupon(null);
            setDiscount(0);
        }
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate discount
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            discountAmount = subtotal * (appliedCoupon.value / 100);
        } else {
            discountAmount = appliedCoupon.value;
        }
    }

    const tax = (subtotal - discountAmount) * 0.1;
    const total = subtotal - discountAmount + tax;

    const handlePlaceOrder = async (customerData) => {
        setLoading(true);
        try {
            const orderData = {
                customerName: `${customerData.firstName} ${customerData.lastName}`,
                customerEmail: customerData.email,
                shippingAddress: `${customerData.address}, ${customerData.city}, ${customerData.zip}`,
                items: items.map(item => ({
                    productId: item.id,
                    title: item.title || item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: total,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            await createOrder(orderData);

            // Call n8n webhook for email confirmation
            const webhookUrl = VITE_N8N_WEBHOOK_URL;
            if (webhookUrl) {
                try {
                    console.log('Sending order data to n8n webhook:', orderData);
                    const response = await axios.post(webhookUrl, orderData);
                    console.log('n8n Webhook Response:', response.data);
                } catch (webhookError) {
                    console.error('Error calling n8n webhook:', webhookError.message);
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
                <h2 className="form-title" style={{ color: 'green' }}>✅</h2>
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
        <div className="page-wrapper">
            <div className="checkout-grid">
                <div className="checkout-section">
                    <h2 className="section-title">Checkout</h2>
                    <CheckoutForm onSubmit={handlePlaceOrder} />
                </div>

                <div className="order-summary-section">
                    <div className="form-container">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="order-items">
                            {items.map(item => (
                                <div key={item.id} className="order-item-row">
                                    <div className="order-item-info">
                                        <img src={item.image} alt={item.title || item.name} className="order-item-thumb" />
                                        <span>{item.title || item.name} (x{item.quantity})</span>
                                    </div>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="coupon-section" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Enter Coupon Code" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="form-input"
                                    style={{ margin: 0 }}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleApplyCoupon}
                                    className="submit-btn"
                                    style={{ margin: 0, width: 'auto', padding: '0 20px' }}
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '5px' }}>{couponError}</p>}
                            {appliedCoupon && (
                                <p style={{ color: '#34d399', fontSize: '0.85rem', marginTop: '5px' }}>
                                    ✓ Coupon {appliedCoupon.code} applied! ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} off)
                                </p>
                            )}
                        </div>

                        <div className="summary-divider"></div>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="summary-row" style={{ color: '#34d399' }}>
                                    <span>Discount ({appliedCoupon?.code})</span>
                                    <span>-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span className="total-amount">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
