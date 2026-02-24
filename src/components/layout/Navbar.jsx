import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemsCount } from '../../redux/slices/cartSlice';
import { setSearchQuery } from '../../redux/slices/productSlice';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/Layout.css';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const cartCount = useSelector(selectCartItemsCount);
    const { searchQuery } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const searchInputRef = useRef(null);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        dispatch(setSearchQuery(query));
        if (location.pathname !== '/shop' && query) {
            navigate('/shop');
        }
    };

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        if (!isSearchVisible) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    useEffect(() => {
        // Close menu/search on route change
        setIsMenuOpen(false);
        if (location.pathname !== '/shop') {
            setIsSearchVisible(false);
        }
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
                <button 
                    className="theme-toggle-btn" 
                    onClick={toggleTheme} 
                    aria-label="Toggle theme"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </button>

                <div className={`search-container ${isSearchVisible ? 'visible' : ''}`}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button className="search-toggle-btn" onClick={toggleSearch} aria-label="Toggle search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </button>
                </div>

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
