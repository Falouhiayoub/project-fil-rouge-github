import React from 'react';
import '../styles/Policy.css';

const LegalPolicy = () => {
    const lastUpdated = "February 16, 2026";

    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1>Privacy Policy</h1>
                <p>Last Updated: {lastUpdated}</p>
            </div>

            <div className="policy-container">
                <section className="policy-section">
                    <h2>1. Information We Collect</h2>
                    <p>At Fashion Fuel, we value your privacy. We collect information that you provide directly to us when you:</p>
                    <ul>
                        <li>Create an account or place an order</li>
                        <li>Sign up for our newsletter</li>
                        <li>Contact our customer support</li>
                        <li>Participate in surveys or promotions</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Send you marketing communications (if you've opted in)</li>
                        <li>Improve our website and shopping experience</li>
                        <li>Protect against fraudulent transactions</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>3. Data Security</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
                </section>

                <section className="policy-section">
                    <h2>4. Cookies</h2>
                    <p>We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction.</p>
                </section>

                <section className="policy-section">
                    <h2>5. Third-Party Disclosure</h2>
                    <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except for trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
                </section>

                <section className="policy-section">
                    <h2>6. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal information at any time. Please contact us if you wish to exercise these rights.</p>
                </section>

                <div className="policy-footer">
                    <p>If you have any questions regarding this privacy policy, you may contact us at <a href="mailto:privacy@fashionfuel.com">privacy@fashionfuel.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default LegalPolicy;
