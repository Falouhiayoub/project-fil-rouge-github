import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, filterByCategory } from '../redux/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import '../styles/Shop.css';

const Shop = () => {
    const dispatch = useDispatch();
    const { filteredItems, loading, error, currentCategory } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleFilter = (category) => {
        dispatch(filterByCategory(category));
    };

    if (loading) return <div className="loading-container">Loading amazing products...</div>;
    if (error) return <div className="error-container">Error loading products: {error}</div>;

    const categories = ['all', 'women', 'men', 'accessories'];

    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1>Our Collection</h1>
                <p>Discover the latest trends and fuel your fashion passion with our curated styles.</p>
                
                <div className="shop-controls">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${currentCategory === cat ? 'active' : ''}`}
                            onClick={() => handleFilter(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="shop-container">
                <div className="products-grid">
                    {filteredItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;
