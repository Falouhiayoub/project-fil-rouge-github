import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/common/ProductCard';
import { clearWishlist } from '../redux/slices/wishlistSlice';
import '../styles/Shop.css'; // Reusing shop grid styles

const Wishlist = () => {
    const { items } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();

    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1>My Wishlist</h1>
                <p>Keep track of the pieces you love. They're waiting for you!</p>
                {items.length > 0 && (
                    <button 
                        className="filter-btn" 
                        onClick={() => dispatch(clearWishlist())}
                        style={{ marginTop: '1rem', border: '1px solid #f87171', color: '#f87171' }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="shop-container">
                {items.length === 0 ? (
                    <div className="loading-container">
                        <p>Your wishlist is empty.</p>
                        <a href="/shop" className="filter-btn active" style={{ display: 'inline-block', marginTop: '2rem', textDecoration: 'none' }}>
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="products-grid">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
