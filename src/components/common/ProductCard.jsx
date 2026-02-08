import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="product-overlay">
                    <button onClick={handleAddToCart} className="quick-add-btn" aria-label="Add to cart">
                        <span>+</span> Quick Add
                    </button>
                </div>
            </div>
            <div className="product-info">
                <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-badge">New</span>
                </div>
                <h3 className="product-title">{product.title}</h3>
                <div className="product-footer">
                    <p className="product-price">{formatCurrency(product.price)}</p>
                    <button onClick={handleAddToCart} className="add-to-cart-icon-btn" aria-label="Add to cart">
                        🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
