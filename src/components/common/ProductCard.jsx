import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation when clicking buttons
        e.stopPropagation();
        dispatch(addToCart(product));
        showToast(`${product.title} added to cart!`);
    };

    return (
        <div className="product-card">
            <Link to={`/shop/${product.id}`} className="product-card-link">
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
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
