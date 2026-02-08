import React, { useState } from 'react';
import axios from 'axios';
import { validateEmail, validateRequired } from '../utils/validation';
import { VITE_N8N_WEBHOOK_URL_CONTACT_PAGE } from '../config/env';
import '../styles/Contact.css'; // Import the new styles

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!validateRequired(formData.name)) newErrors.name = 'Name is required';
        if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
        if (!validateRequired(formData.message)) newErrors.message = 'Message is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            // Call n8n webhook for contact form submission
            const webhookUrl = VITE_N8N_WEBHOOK_URL_CONTACT_PAGE;
            if (webhookUrl) {
                console.log('Sending contact data to n8n webhook:', formData);
                const response = await axios.post(webhookUrl, formData);
                console.log('n8n Webhook Response:', response.data);
            } else {
                console.warn('n8n contact webhook URL is not defined in environment variables.');
            }

            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error.message);
            alert('There was an error sending your message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="contact-page">
                <div className="contact-container contact-success">
                    <h2 className="contact-title">Thank You!</h2>
                    <p>Your message has been sent successfully. We will get back to you soon.</p>
                    <button className="contact-btn" onClick={() => setSubmitted(false)}>Send Another Message</button>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-page">
            <div className="contact-container">
                <h2 className="contact-title">Contact Us</h2>
                <p className="contact-subtitle">We'd love to hear from you</p>
                <form onSubmit={handleSubmit}>
                    <div className="contact-form-group">
                        <label className="contact-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="contact-input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                        />
                        {errors.name && <div className="contact-error">{errors.name}</div>}
                    </div>

                    <div className="contact-form-group">
                        <label className="contact-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="contact-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                        />
                        {errors.email && <div className="contact-error">{errors.email}</div>}
                    </div>

                    <div className="contact-form-group">
                        <label className="contact-label">Message</label>
                        <textarea
                            name="message"
                            className="contact-textarea"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="How can we help?"
                        />
                        {errors.message && <div className="contact-error">{errors.message}</div>}
                    </div>

                    <button type="submit" className="contact-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
