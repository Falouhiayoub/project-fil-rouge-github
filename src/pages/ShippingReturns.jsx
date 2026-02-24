import React from 'react';
import '../styles/Policy.css';

const ShippingReturns = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1>Shipping & Returns</h1>
                <p>Everything you need to know about our delivery and exchange process.</p>
            </div>

            <div className="policy-container">
                <section className="policy-section">
                    <h2>Shipping Information</h2>
                    <div className="policy-card">
                        <h3>Domestic Shipping (USA)</h3>
                        <ul>
                            <li><strong>Standard Shipping:</strong> 3-5 business days - $5.99 (Free on orders over $100)</li>
                            <li><strong>Express Shipping:</strong> 1-2 business days - $14.99</li>
                            <li><strong>Next Day Delivery:</strong> Orders placed before 12 PM EST - $24.99</li>
                        </ul>
                    </div>

                    <div className="policy-card">
                        <h3>International Shipping</h3>
                        <p>We ship to over 50 countries worldwide. International shipping rates are calculated at checkout based on destination and weight.</p>
                        <ul>
                            <li><strong>Canada & Mexico:</strong> 5-10 business days</li>
                            <li><strong>Europe & UK:</strong> 7-14 business days</li>
                            <li><strong>Rest of World:</strong> 10-21 business days</li>
                        </ul>
                    </div>
                </section>

                <section className="policy-section">
                    <h2>Returns & Exchanges</h2>
                    <div className="policy-card">
                        <h3>30-Day Return Policy</h3>
                        <p>We want you to love your purchase! If you're not completely satisfied, you can return or exchange your items within 30 days of delivery.</p>
                        <div className="policy-steps">
                            <div className="step">
                                <span className="step-num">1</span>
                                <p>Ensure items are unworn, unwashed, and have original tags attached.</p>
                            </div>
                            <div className="step">
                                <span className="step-num">2</span>
                                <p>Visit our Returns Portal to generate a prepaid shipping label.</p>
                            </div>
                            <div className="step">
                                <span className="step-num">3</span>
                                <p>Drop off your package at any authorized carrier location.</p>
                            </div>
                        </div>
                    </div>

                    <div className="policy-card">
                        <h3>Refunds</h3>
                        <p>Once we receive your return, please allow 5-7 business days for processing. Refunds will be issued to your original payment method.</p>
                    </div>
                </section>

                <div className="policy-footer">
                    <p>Need more help? <a href="/contact">Contact our support team</a></p>
                </div>
            </div>
        </div>
    );
};

export default ShippingReturns;
