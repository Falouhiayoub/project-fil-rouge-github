import React, { useState } from 'react';
import { validateRequired, validateEmail } from '../../../utils/validation';

const CheckoutForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Basic validation
        ['firstName', 'lastName', 'address', 'city', 'zip', 'cardNumber', 'expiry', 'cvv'].forEach(field => {
            if (!validateRequired(formData[field])) {
                newErrors[field] = 'This field is required';
            }
        });
        if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h3 style={{ marginBottom: '1rem' }}>Shipping Information</h3>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
                    {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                </div>
                <div>
                    <label className="form-label">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
                    {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="form-input" />
                {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
                <label className="form-label">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="form-input" />
                {errors.address && <div className="form-error">{errors.address}</div>}
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">City</label>
                    <input name="city" value={formData.city} onChange={handleChange} className="form-input" />
                    {errors.city && <div className="form-error">{errors.city}</div>}
                </div>
                <div>
                    <label className="form-label">ZIP Code</label>
                    <input name="zip" value={formData.zip} onChange={handleChange} className="form-input" />
                    {errors.zip && <div className="form-error">{errors.zip}</div>}
                </div>
            </div>

            <h3 style={{ margin: '1.5rem 0 1rem' }}>Payment Details</h3>
            <div className="form-group">
                <label className="form-label">Card Number</label>
                <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="form-input" placeholder="0000 0000 0000 0000" />
                {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label className="form-label">Expiry Date</label>
                    <input name="expiry" value={formData.expiry} onChange={handleChange} className="form-input" placeholder="MM/YY" />
                    {errors.expiry && <div className="form-error">{errors.expiry}</div>}
                </div>
                <div>
                    <label className="form-label">CVV</label>
                    <input name="cvv" value={formData.cvv} onChange={handleChange} className="form-input" placeholder="123" />
                    {errors.cvv && <div className="form-error">{errors.cvv}</div>}
                </div>
            </div>

            <button type="submit" className="submit-btn">Place Order</button>
        </form>
    );
};

export default CheckoutForm;
