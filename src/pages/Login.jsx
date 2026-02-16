import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { validateEmail, validateRequired } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import '../styles/Login.css'; // Import the new specific styles

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
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
                navigate('/'); // Redirect to Home as requested
            } else {
                setErrors({ email: 'Please enter a valid email for user login' });
                showToast('Invalid email address', 'error');
            }
        } else {
            setLoginError('Invalid credentials');
            showToast('Please check your credentials', 'error');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Welcome Back</h2>
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
                    <p>Don't have an account? <a href="#">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
