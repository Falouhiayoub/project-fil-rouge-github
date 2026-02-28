import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { login } from '../redux/slices/authSlice';
import { validateEmail, validateRequired } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import '../styles/Login.css'; // Import the new specific styles

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    
    // Get the page where the user came from
    const from = location.state?.from?.pathname || '/';

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setLoginError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Basic validation
        if (!validateRequired(formData.email)) {
            newErrors.email = 'Email/Username is required';
        }
        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const { email, password } = formData;

        // User Login Logic
        if (email && password) {
            // For now, accept any non-empty credentials that aren't admin
            if (validateEmail(email)) {
                dispatch(login({ email, role: 'user' }));
                showToast(`Welcome back, ${email}!`);
                navigate(from, { replace: true }); 
            } else {
                setErrors({ email: 'Please enter a valid email for user login' });
                showToast('Invalid email address', 'error');
            }
        } else {
            setLoginError('Invalid credentials');
            showToast('Please check your credentials', 'error');
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const decoded = jwtDecode(response.credential);
            const userEmail = decoded.email;
            
            dispatch(login({ email: userEmail, role: 'user' }));
            showToast(`Welcome back, ${userEmail}!`);
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google login decoding error:', error);
            showToast('Error connecting with Google', 'error');
        }
    };

    const handleGoogleLoginError = () => {
        showToast('Google Login Failed', 'error');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Welcome Back</h2>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <GoogleLogin 
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                        theme="filled_blue"
                        shape="pill"
                        text="continue_with"
                        width="100%"
                    />
                </div>

                <div className="login-divider">OR</div>

                <form onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label className="login-label" htmlFor="email">Email or Username</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="login-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                        {errors.email && <div className="login-error">{errors.email}</div>}
                    </div>

                    <div className="login-form-group">
                        <label className="login-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="login-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                        {errors.password && <div className="login-error">{errors.password}</div>}
                    </div>

                    {loginError && <div className="login-error" style={{ justifyContent: 'center', marginBottom: '1rem' }}>{loginError}</div>}

                    <button type="submit" className="login-btn">Login</button>
                </form>
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
