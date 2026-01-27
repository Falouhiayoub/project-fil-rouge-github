import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';

const CartSummary = ({ items }) => {
    const navigate = useNavigate();
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // flat 10% tax for example
    const total = subtotal + tax;

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-row">
                <span>Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
            </div>
            <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
            </button>
        </div>
    );
};

export default CartSummary;
