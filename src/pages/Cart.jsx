import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import CartItem from '../components/features/cart/CartItem';
import CartSummary from '../components/features/cart/CartSummary';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);

    return (
        <div className="cart-page-container cart-page-bg">
            {items.length === 0 ? (
                <div className="empty-cart-container">
                    <div className="empty-cart-card">
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/shop" className="continue-shopping-btn">Start Shopping</Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="cart-header">
                        <h2>Shopping Cart ({items.length} items)</h2>
                        <button onClick={() => dispatch(clearCart())} className="clear-cart-btn">Clear Cart</button>
                    </div>

                    <div className="cart-content">
                        <div className="cart-items-list">
                            {items.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div className="cart-summary-wrapper">
                            <CartSummary items={items} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
