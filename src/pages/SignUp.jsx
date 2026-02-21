import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { validateEmail, validateRequired } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import '../styles/Login.css'; // Reusing Login styles for consistency

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateRequired(formData.username)) {
            newErrors.username = 'Username is required';
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Simulate registration
        dispatch(login({ email: formData.email, role: 'user' }));
        showToast('Account created successfully! Welcome to Fashion Fuel.');
        navigate('/');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label className="login-label" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="login-input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                        />
                        {errors.username && <div className="login-error">{errors.username}</div>}
                    </div>

                    <div className="login-form-group">
                        <label className="login-label" htmlFor="email">Email</label>
                        <input
                            type="email"
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
                            placeholder="Create a password"
                        />
                        {errors.password && <div className="login-error">{errors.password}</div>}
                    </div>

                    <div className="login-form-group">
                        <label className="login-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="login-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                        />
                        {errors.confirmPassword && <div className="login-error">{errors.confirmPassword}</div>}
                    </div>

                    <button type="submit" className="login-btn">Sign Up</button>
                </form>
                <div className="login-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
