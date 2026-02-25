import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import SEO from '../components/common/SEO';
import RecentlyViewed from '../components/common/RecentlyViewed';
// MUI Icons
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ShieldIcon from '@mui/icons-material/Shield';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import heroVideo from '../assets/vidéo.mp4';
import jacketImg from '../assets/jacket.jpg';
import jacket2Img from '../assets/jacket2.jpg';
import nightDressImg from '../assets/night dress.jpg';
import isweImg from '../assets/Iswe.jpg';
import womenCollectionImg from '../assets/womenCollection.jpg';
import menCollectionImg from '../assets/menCollection.jpg';
import accessoriesCollectionImg from '../assets/Accessories_Collection.jpg';
import dressImg from '../assets/dress.jpg';
import mensImg from "../assets/Men's.jpg";
import hazelImg from '../assets/Hazel.jpg';
import cargoImg from '../assets/cargo.jpg';
import '../styles/Home.css';

const Home = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.products);
    const { favoriteCategories, recentlyViewedIds } = useSelector((state) => state.userPreference);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, items.length]);

    const personalizedRecommendations = useMemo(() => {
        if (!items.length) return [];
        
        // Find favorite category
        const sortedCategories = Object.entries(favoriteCategories)
            .sort(([, a], [, b]) => b - a);
        
        if (sortedCategories.length === 0) return [];
        
        const topCategory = sortedCategories[0][0];
        
        return items
            .filter(item => item.category === topCategory && !recentlyViewedIds.includes(item.id))
            .slice(0, 4);
    }, [items, favoriteCategories, recentlyViewedIds]);

    const testimonials = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Fashion Blogger",
            content: "The quality of the pieces I received is absolutely mind-blowing. Fast shipping and the branding is top-tier!",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2000&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Michael Ross",
            role: "Entrepreneur",
            content: "Found my new favorite store. The urban collection fits perfectly and the customer support is truly 24/7.",
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            role: "Stylist",
            content: "As a stylist, I'm very picky with fabrics. Fashion Fuel exceeds expectations every single time. 10/10!",
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2000&auto=format&fit=crop"
        }
    ];

    const benefits = [
        {
            id: 1,
            title: "24/7 Support",
            desc: "Always here to help",
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            color: "#c084fc"
        },
        {
            id: 2,
            title: "Secure Payment",
            desc: "100% safe transactions",
            icon: <ShieldIcon sx={{ fontSize: 40 }} />,
            color: "#60a5fa"
        },
        {
            id: 3,
            title: "Best Products",
            desc: "Handpicked quality",
            icon: <WorkspacePremiumIcon sx={{ fontSize: 40 }} />,
            color: "#fbbf24"
        },
        {
            id: 4,
            title: "Fast Delivery",
            desc: "Express shipping",
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            color: "#34d399"
        },
        {
            id: 5,
            title: "Easy Returns",
            desc: "30-day guarantee",
            icon: <AutorenewIcon sx={{ fontSize: 40 }} />,
            color: "#f87171"
        }
    ];

    const featuredProducts = [
        {
            id: 101,
            name: "Classic Urban Jacket",
            price: 129.99,
            image: jacket2Img,
            category: "men"
        },
        {
            id: 102,
            name: "Silk Evening Dress",
            price: 199.50,
            image: nightDressImg,
            category: "women"
        },
        {
            id: 103,
            name: "Premium Leather Tote",
            price: 85.00,
            image: isweImg,
            category: "accessories"
        }
    ];

    const categories = [
        {
            id: 1,
            title: 'Women\'s Collection',
            image: womenCollectionImg,
            link: '/shop?category=women'
        },
        {
            id: 2,
            title: 'Men\'s Collection',
            image: menCollectionImg,
            link: '/shop?category=men'
        },
        {
            id: 3,
            title: 'Accessories',
            image: accessoriesCollectionImg,
            link: '/shop?category=accessories'
        }
    ];

    const newArrivals = [
        {
            id: 'new-1',
            name: "Summer Linen Shirt",
            price: 75.00,
            image: mensImg,
            category: "men",
            isNew: true
        },
        {
            id: 'new-2',
            name: "Floral Summer Dress",
            price: 110.00,
            image: hazelImg,
            category: "women",
            isNew: true
        },
        {
            id: 'new-3',
            name: "Urban Cargo Pants",
            price: 95.00,
            image: cargoImg,
            category: "men",
            isNew: true
        },
        {
            id: 'new-4',
            name: "Gold Minimalist Watch",
            price: 150.00,
            image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2000&auto=format&fit=crop",
            category: "accessories",
            isNew: true
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    return (
        <div className="home-container">
            <SEO
                title="Premium Apparel & Urban Style"
                description="Explore the latest trends and timeless classics at Fashion Fuel. Elevate your wardrobe with our handpicked premium collection."
                url="/"
            />
            
            {/* Hero Section */}
            <section className="hero-section">
                <video
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay"></div>
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={itemVariants}>Discover Your Style</motion.h1>
                    <motion.p variants={itemVariants}>Explore the latest trends and timeless classics. Elevate your wardrobe today.</motion.p>
                    <motion.div variants={itemVariants}>
                        <Link to="/shop" className="shop-now-btn">Shop Now</Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Personalized Recommendations Section */}
            {personalizedRecommendations.length > 0 && (
                <section className="featured-products-section recommendations">
                    <div className="section-header">
                        <div className="title-with-badge">
                            <h2 className="creative-title">Recommended For You</h2>
                            <span className="premium-badge">Just for you</span>
                        </div>
                        <Link to="/shop" className="view-all-link">Based on your taste <span>→</span></Link>
                    </div>

                    <div className="products-grid">
                        {personalizedRecommendations.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            <section className="featured-products-section">
                <div className="section-header">
                    <h2 className="creative-title">Featured Products</h2>
                    <Link to="/shop" className="view-all-link">View All Items <span>→</span></Link>
                </div>

                <div className="products-grid">
                    {featuredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            className="product-flash-card"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="product-image-container">
                                <img src={product.image} alt={product.name} />
                                <div className="product-badge">Top Rated</div>
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <div className="product-meta">
                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                    <button
                                        className="quick-add-btn"
                                        onClick={() => handleAddToCart(product)}
                                        title="Add to Cart"
                                    >
                                        <svg 
                                            width="18" 
                                            height="18" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            className="btn-icon"
                                        >
                                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                        </svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Deal of the Week Section */}
            <section className="deal-section">
                <div className="deal-container">
                    <motion.div
                        className="deal-image"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" alt="Seasonal Sale" />
                    </motion.div>

                    <motion.div
                        className="deal-content"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <span className="deal-label">Limited Time Offer</span>
                        <h2 className="deal-title">Deal of the Week</h2>
                        <p className="deal-description">
                            Experience the pinnacle of fashion with our exclusive weekly selection.
                            Carefully curated styles that define your personality, now at an irresistible value.
                        </p>

                        <div className="countdown-timer">
                            <div className="timer-square">
                                <span className="timer-value">999</span>
                                <span className="timer-label">Days</span>
                            </div>
                            <div className="timer-square">
                                <span className="timer-value">14</span>
                                <span className="timer-label">Hours</span>
                            </div>
                            <div className="timer-square">
                                <span className="timer-value">43</span>
                                <span className="timer-label">Mins</span>
                            </div>
                            <div className="timer-square">
                                <span className="timer-value">55</span>
                                <span className="timer-label">Secs</span>
                            </div>
                        </div>

                        <Link to="/shop" className="deal-shop-btn">Shop Now</Link>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="benefits-header">
                    <span className="benefits-subtitle">Our Promise</span>
                    <h2 className="benefits-title">What We Provide</h2>
                </div>

                <div className="benefits-container">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.id}
                            className="benefit-circle-wrapper"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="benefit-circle" style={{ backgroundColor: benefit.color }}>
                                <div className="benefit-icon">
                                    {benefit.icon}
                                </div>
                            </div>
                            <div className="benefit-info">
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        </motion.div>
                    ))}
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

            {/* New Arrivals Section */}
            <section className="featured-products-section new-arrivals-section">
                <div className="section-header">
                    <div className="title-with-badge">
                        <h2 className="creative-title">New Arrivals</h2>
                        <span className="premium-badge new-badge">Upcoming</span>
                    </div>
                    <Link to="/shop" className="view-all-link">Explore Latest <span>→</span></Link>
                </div>

                <div className="products-grid">
                    {newArrivals.map((product) => (
                        <motion.div
                            key={product.id}
                            className="product-flash-card"
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="product-image-container">
                                <img src={product.image} alt={product.name} />
                                <div className="product-badge new-arrival-label">Just Arrived</div>
                            </div>
                            <div className="product-info">
                                <span className="product-category-label">{product.category}</span>
                                <h3>{product.name}</h3>
                                <div className="product-meta">
                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                    <button
                                        className="quick-add-btn"
                                        onClick={() => handleAddToCart(product)}
                                        title="Add to Cart"
                                    >
                                        <svg 
                                            width="18" 
                                            height="18" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            className="btn-icon"
                                        >
                                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                        </svg>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="section-header-centered">
                    <span className="subtitle">Testimonials</span>
                    <h2 className="creative-title-dark">What Our Clients Say</h2>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="quote-icon-wrapper">
                                <FormatQuoteIcon className="quote-icon" />
                            </div>
                            <p className="testimonial-text">"{testimonial.content}"</p>
                            <div className="testimonial-stars">
                                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                                    <StarIcon key={i} />
                                ))}
                                {testimonial.rating % 1 !== 0 && <StarHalfIcon />}
                            </div>
                            <div className="testimonial-footer">
                                <div className="client-avatar">
                                    <img src={testimonial.image} alt={testimonial.name} />
                                </div>
                                <div className="client-info">
                                    <h4>{testimonial.name}</h4>
                                    <span>{testimonial.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <RecentlyViewed />
        </div>
    );
};

export default Home;
