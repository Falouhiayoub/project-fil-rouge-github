import React, { useState, useEffect } from 'react';
import { getReviews } from '../../../services/api';
import ReviewForm from './ReviewForm';
import { formatCurrency } from '../../../utils/formatCurrency';

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await getReviews(productId);
            // MockAPI might return all reviews if filtering doesn't work out of the box
            // so we filter client-side just in case.
            const filteredReviews = Array.isArray(response.data) 
                ? response.data.filter(r => r.productId === productId)
                : [];
            setReviews(filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    return (
        <div className="review-section" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Customer Reviews ({reviews.length})</h2>
            
            <div className="reviews-list">
                {loading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to share your style!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card" style={{ 
                            padding: '1.5rem', 
                            borderBottom: '1px solid var(--gray-200)',
                            marginBottom: '1rem',
                            background: 'var(--white)',
                            borderRadius: '12px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <strong>{review.userName}</strong>
                                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                {renderStars(review.rating)}
                            </div>
                            <p style={{ margin: '0.5rem 0' }}>{review.comment}</p>
                            {review.userImage && (
                                <div style={{ marginTop: '1rem' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Styled by {review.userName}:</p>
                                    <img 
                                        src={review.userImage} 
                                        alt="Styled look" 
                                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'cover' }} 
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <ReviewForm productId={productId} onReviewAdded={fetchReviews} />
        </div>
    );
};

export default ReviewSection;
