import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { validateRequired } from '../utils/validation';
import '../styles/Login.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setLoginError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateRequired(formData.username)) {
            newErrors.username = 'Username is required';
        }
        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const { username, password } = formData;

        // Admin-only login logic
        if (username === 'admin' && password === 'password123') {
            dispatch(login({ email: 'admin@fashionfuel.com', role: 'admin' }));
            navigate('/admin');
        } else {
            setLoginError('Invalid administrator credentials');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Admin Access</h2>
                <form onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label className="login-label" htmlFor="username">Admin Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="login-input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                        />
                        {errors.username && <div className="login-error">{errors.username}</div>}
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
                            placeholder="Enter password"
                        />
                        {errors.password && <div className="login-error">{errors.password}</div>}
                    </div>

                    {loginError && <div className="login-error" style={{ justifyContent: 'center', marginBottom: '1rem' }}>{loginError}</div>}

                    <button type="submit" className="login-btn">Secure Login</button>
                </form>
                <div className="login-footer">
                    <p>Go back to <a href="/">Storefront</a></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
