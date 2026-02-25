import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const wishlistItems = useSelector(state => state.wishlist.items);
    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(product));
        showToast(`${product.title} added to cart!`);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
        showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    return (
        <div className="product-card">
            <Link to={`/shop/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                    <img src={product.image} alt={product.title} className="product-image" />
                    <button 
                        onClick={handleToggleWishlist} 
                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill={isWishlisted ? 'currentColor' : 'none'} 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                    <div className="product-overlay">
                        <button onClick={handleAddToCart} className="quick-add-btn" aria-label="Add to cart">
                            <span>+</span> Quick Add
                        </button>
                    </div>
                </div>
                <div className="product-info">
                    <div className="product-meta">
                        <span className="product-category">{product.category}</span>
                        {product.stock <= 3 && product.stock > 0 ? (
                            <span className="product-badge low-stock">Low Stock: {product.stock}</span>
                        ) : product.stock === 0 ? (
                            <span className="product-badge out-of-stock">Out of Stock</span>
                        ) : (
                            <span className="product-badge">New</span>
                        )}
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
