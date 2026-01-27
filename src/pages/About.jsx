import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-background"></div>
            <div className="about-content">
                <h1 className="about-title">About Fashion Fuel</h1>
                <div className="about-description">
                    <p>
                        Welcome to Fashion Fuel, your ultimate destination for contemporary style and timeless elegance.
                        We believe that fashion is more than just clothing; it's a form of self-expression, a way to tell your story without saying a word.
                    </p>
                    <p>
                        Founded with a passion for quality and an eye for detail, we curate collections that blend modern trends with classic sophistication.
                        Whether you're looking for the perfect outfit for a special occasion or updating your everyday wardrobe,
                        FashionHub offers a diverse range of apparel designed to make you look and feel your absolute best.
                    </p>
                    <p>
                        Our mission is to empower individuals through fashion, providing accessible luxury and an seamless shopping experience.
                        Join us on this journey of style and discover the pieces that speak to you.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
