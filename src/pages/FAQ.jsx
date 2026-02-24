import React, { useState } from 'react';
import '../styles/FAQ.css';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                {question}
                <span className="faq-icon">{isOpen ? '-' : '+'}</span>
            </button>
            <div className="faq-answer">
                <p>{answer}</p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const faqData = [
        {
            question: "What is Fashion Fuel?",
            answer: "Fashion Fuel is your ultimate e-commerce destination for premium and trendy apparel. We curate high-quality fashion to empower your personal style."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping usually takes 3-5 business days. Express shipping is available and takes 1-2 business days depending on your location."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unworn items with original tags. Simply visit our Returns portal to start the process."
        },
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive an email with a tracking number and a link to monitor your delivery status."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 50 countries worldwide. International shipping times vary based on the destination."
        },
        {
            question: "Can I cancel my order?",
            answer: "Orders can be cancelled within 1 hour of placement. Please contact our support team immediately if you need to make changes."
        },
        {
            question: "Are there any physical stores?",
            answer: "Currently, we operate exclusively online to provide the best prices and selection directly to our customers."
        }
    ];

    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1>Frequently Asked Questions</h1>
                <p>Everything you need to know about shopping with Fashion Fuel.</p>
            </div>

            <div className="faq-container">
                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>

                <div className="faq-contact-box">
                    <h3>Still have questions?</h3>
                    <p>Our support team is here to help you 24/7.</p>
                    <a href="/contact" className="faq-contact-btn">Contact Us</a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
