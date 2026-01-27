import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { validateEmail, validateRequired } from '../utils/validation';
import '../styles/Forms.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

        // Unified Login Logic
        if (email === 'admin' && password === 'password123') {
            // Admin Login
            dispatch(login({ email, role: 'admin' }));
            navigate('/admin');
        } else if (email && password) {
            // Normal User Login (Mock)
            // For now, accept any non-empty credentials that aren't admin
            if (validateEmail(email)) {
                dispatch(login({ email, role: 'user' }));
                navigate('/'); // Redirect to Home as requested
            } else {
                setErrors({ email: 'Please enter a valid email for user login' });
            }
        } else {
            setLoginError('Invalid credentials');
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address or Username</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email or 'admin'"
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                    {errors.password && <div className="form-error">{errors.password}</div>}
                </div>

                {loginError && <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{loginError}</div>}

                <button type="submit" className="submit-btn">Login</button>
            </form>
            <div className="form-footer">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </div>
    );
};

export default Login;
