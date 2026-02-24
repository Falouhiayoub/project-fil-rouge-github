import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../redux/slices/cartSlice';
import { formatCurrency } from '../../../utils/formatCurrency';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
        }
    };

    const handleRemove = () => {
        dispatch(removeFromCart(item.id));
    };

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.title || item.name} className="cart-item-image" />

            <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title || item.name}</h3>
                <p className="cart-item-price">{formatCurrency(item.price)}</p>
            </div>

            <div className="cart-item-actions">
                <div className="quantity-controls">
                    <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        <RemoveIcon fontSize="small" />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                    >
                        <AddIcon fontSize="small" />
                    </button>
                </div>
            </div>

            <div className="cart-item-total">
                {formatCurrency(item.price * item.quantity)}
            </div>

            <button onClick={handleRemove} className="remove-icon-btn" aria-label="Remove item">
                <DeleteOutlineIcon />
            </button>
        </div>
    );
};

export default CartItem;
