import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const RecentlyViewed = ({ title = "Recently Viewed", limit = 4 }) => {
    const { recentlyViewedIds } = useSelector((state) => state.userPreference);
    const { items: allProducts } = useSelector((state) => state.products);

    // Filter allProducts based on recentlyViewedIds, maintaining the order of the IDs
    const recentlyViewedProducts = recentlyViewedIds
        .map(id => allProducts.find(p => String(p.id) === String(id)))
        .filter(p => p !== undefined)
        .slice(0, limit);

    if (recentlyViewedProducts.length === 0) return null;

    return (
        <section className="related-products" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">{title}</h2>
            <div className="related-products-grid">
                {recentlyViewedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
