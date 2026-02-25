import React, { useState } from 'react';
import ImageUpload from '../../common/ImageUpload';
import { createReview } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const ReviewForm = ({ productId, onReviewAdded }) => {
    const { showToast } = useToast();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [image, setImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment || !userName) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                productId,
                rating,
                comment,
                userName,
                userImage: image,
                date: new Date().toISOString()
            };
            await createReview(reviewData);
            showToast('Thank you for your review!');
            setComment('');
            setUserName('');
            setImage('');
            if (onReviewAdded) onReviewAdded();
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast('Failed to submit review', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <h3 className="form-title">Write a Review</h3>
            
            <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                    type="text"
                    className="form-input"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Rating</label>
                <select 
                    className="form-input" 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Review</label>
                <textarea
                    className="form-input"
                    style={{ minHeight: '100px' }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                />
            </div>

            <ImageUpload onUploadSuccess={(url) => setImage(url)} />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Post Review'}
            </button>
        </form>
    );
};

export default ReviewForm;
