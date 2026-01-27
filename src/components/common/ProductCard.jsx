import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    };

    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">{formatCurrency(product.price)}</p>
                <button onClick={handleAddToCart} className="add-to-cart-btn">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
