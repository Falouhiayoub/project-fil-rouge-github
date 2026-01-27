import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../redux/slices/cartSlice';
import { formatCurrency } from '../../../utils/formatCurrency';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
        }
    };

    const handleRemove = () => {
        dispatch(removeFromCart(item.id));
    };

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-price">{formatCurrency(item.price)}</p>
            </div>
            <div className="cart-item-actions">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                />
                <button onClick={handleRemove} className="remove-btn">Remove</button>
            </div>
            <div className="cart-item-total">
                {formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    );
};

export default CartItem;
