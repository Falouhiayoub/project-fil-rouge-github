import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { clearSelectedProduct, fetchProductById, fetchProducts } from '../redux/slices/productSlice';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/common/ProductCard';
import SEO from '../components/common/SEO';
import { SkeletonDetail } from '../components/common/Skeleton';
import { formatCurrency } from '../utils/formatCurrency';
import '../styles/ProductDetail.css';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = [
    { name: 'Black', hex: '#111827' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Rose', hex: '#f472b6' }
];

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { selectedProduct, items, loading, error } = useSelector((state) => state.products);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeInfoTab, setActiveInfoTab] = useState('description');

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
        if (items.length === 0) {
            dispatch(fetchProducts());
        }
        return () => {
            dispatch(clearSelectedProduct());
        };
    }, [dispatch, id, items.length]);

    const product = selectedProduct;

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return items
            .filter((item) => item.category === product.category && item.id !== product.id)
            .slice(0, 4);
    }, [items, product]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize || !selectedColor) {
            showToast('Please choose a size and color before adding to cart.', 'error');
            return;
        }

        dispatch(
            addToCart({
                ...product,
                selectedSize,
                selectedColor,
                quantity
            })
        );

        showToast('Product added to your cart.');
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <SkeletonDetail />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper">
                <div className="product-error">Could not load product details.</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-wrapper">
                <div className="product-error">Product not found.</div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <SEO
                title={product.title}
                description={`Discover ${product.title} in the Fashion Fuel ${product.category} collection.`}
                image={product.image}
                url={`/shop/${product.id}`}
            />

            <div className="product-detail-page">
                <div className="product-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/shop">Shop</Link>
                    <span>/</span>
                    <span>{product.title}</span>
                </div>

                <div className="product-detail-grid">
                    <div className="product-detail-image-wrap">
                        <img src={product.image} alt={product.title} className="product-detail-image" />
                    </div>

                    <div className="product-detail-content">
                        <span className="product-detail-category">{product.category}</span>
                        <h1 className="product-detail-title">{product.title}</h1>
                        <p className="product-detail-price">{formatCurrency(product.price)}</p>

                        <p className="product-detail-summary">
                            A premium piece designed for everyday comfort and statement style.
                            Made with durable materials and crafted for a modern fit.
                        </p>

                        <div className="variant-block">
                            <p className="variant-label">Size</p>
                            <div className="size-list">
                                {SIZE_OPTIONS.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`size-item ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="variant-block">
                            <p className="variant-label">Color</p>
                            <div className="color-list">
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        className={`color-item ${selectedColor === color.name ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color.name)}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                        aria-label={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="purchase-row">
                            <div className="qty-control">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button type="button" onClick={() => setQuantity((prev) => prev + 1)}>
                                    +
                                </button>
                            </div>

                            <button type="button" className="add-main-btn" onClick={handleAddToCart}>
                                Add to cart
                            </button>
                        </div>

                        <div className="info-tabs">
                            <div className="tab-buttons">
                                <button
                                    type="button"
                                    className={activeInfoTab === 'description' ? 'active' : ''}
                                    onClick={() => setActiveInfoTab('description')}
                                >
                                    Description
                                </button>
                                <button
                                    type="button"
                                    className={activeInfoTab === 'material' ? 'active' : ''}
                                    onClick={() => setActiveInfoTab('material')}
                                >
                                    Material & Care
                                </button>
                            </div>

                            {activeInfoTab === 'description' && (
                                <div className="tab-panel">
                                    <p>
                                        {product.title} is part of our new-season drop with a clean silhouette,
                                        lightweight feel, and versatile styling for casual and elevated looks.
                                    </p>
                                </div>
                            )}

                            {activeInfoTab === 'material' && (
                                <div className="tab-panel">
                                    <ul>
                                        <li>Material: 100% cotton blend</li>
                                        <li>Care: Machine wash cold</li>
                                        <li>Drying: Low tumble or hang dry</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>You might also like</h2>
                        <div className="related-products-grid">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
