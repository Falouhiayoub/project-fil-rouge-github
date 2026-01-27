import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    const categories = [
        {
            id: 1,
            title: 'Women\'s Collection',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop',
            link: '/shop?category=women'
        },
        {
            id: 2,
            title: 'Men\'s Collection',
            image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2000&auto=format&fit=crop',
            link: '/shop?category=men'
        },
        {
            id: 3,
            title: 'Accessories',
            image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=2193&auto=format&fit=crop',
            link: '/shop?category=accessories'
        }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Discover Your Style</h1>
                    <p>Explore the latest trends and timeless classics. Elevate your wardrobe today.</p>
                    <Link to="/shop" className="shop-now-btn">Shop Now</Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="featured-section">
                <h2 className="section-title">Shop by Category</h2>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <Link to={cat.link} key={cat.id} className="category-card">
                            <img src={cat.image} alt={cat.title} />
                            <div className="category-overlay">
                                <h3>{cat.title}</h3>
                                <span>View Collection</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
