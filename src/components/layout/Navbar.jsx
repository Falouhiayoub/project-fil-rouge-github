
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../../redux/slices/cartSlice';
import '../../styles/Layout.css';

const Navbar = () => {
    const cartCount = useSelector(selectCartItemsCount);
    return (
        <nav className="navbar">
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
