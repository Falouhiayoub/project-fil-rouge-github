import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/slices/authSlice';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

const HomeLoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (email === 'admin' && password === 'password123') {
            dispatch(login({ email, role: 'admin' }));
            navigate('/admin');
        } else if (email && password) {
            // Mock user login - accept any non-empty credentials for now if not admin
            dispatch(login({ email, role: 'user' }));
            navigate('/shop');
        } else {
            setError('Please enter valid credentials.');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" align="center" gutterBottom>
                Welcome Back
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email / Username"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" variant="contained" fullWidth size="large">
                    Login
                </Button>
            </Box>
        </Paper>
    );
};

export default HomeLoginForm;
