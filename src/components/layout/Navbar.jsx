import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../../redux/slices/cartSlice';
import '../../styles/Layout.css';

const Navbar = () => {
    const cartCount = useSelector(selectCartItemsCount);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Close menu on route change
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navbarClasses = [
        'navbar',
        isHomePage ? 'navbar-transparent' : '',
        isScrolled ? 'scrolled' : '',
        isMenuOpen ? 'menu-open' : ''
    ].join(' ').trim();

    return (
        <nav className={navbarClasses}>
            <div className="navbar-logo">
                <Link to="/">Fashion Fuel</Link>
            </div>

            <button 
                className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Home
                </NavLink>
                <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Shop
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    About
                </NavLink>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Contact
                </NavLink>
                <Link to="/login" className="login-btn mobile-only">
                    Login
                </Link>
            </div>

            <div className="navbar-actions">
                <Link to="/cart" className="cart-icon-wrapper">
                    <svg 
                        className="cart-svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <span className="cart-count">{cartCount}</span>
                </Link>
                <Link to="/login" className="login-btn">
                    Login
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
