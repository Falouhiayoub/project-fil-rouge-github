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

    const navbarClasses = [
        'navbar',
        isHomePage ? 'navbar-transparent' : '',
        isScrolled ? 'scrolled' : ''
    ].join(' ').trim();

    return (
        <nav className={navbarClasses}>
            <div className="navbar-logo">
                <Link to="/">Fashion Fuel</Link>
            </div>

            <div className="navbar-links">
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
            </div>

            <div className="navbar-actions">
                <Link to="/cart" className="cart-icon-wrapper">
                    <span>🛒</span>
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
