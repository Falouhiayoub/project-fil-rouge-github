import React from 'react';
import '../../styles/Skeleton.css';

export const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image shimmer"></div>
            <div className="skeleton-info">
                <div className="skeleton-meta shimmer"></div>
                <div className="skeleton-title shimmer"></div>
                <div className="skeleton-footer">
                    <div className="skeleton-price shimmer"></div>
                    <div className="skeleton-btn shimmer"></div>
                </div>
            </div>
        </div>
    );
};

export const SkeletonDetail = () => {
    return (
        <div className="skeleton-detail-container">
            <div className="skeleton-breadcrumb shimmer"></div>
            <div className="skeleton-main">
                <div className="skeleton-gallery shimmer"></div>
                <div className="skeleton-info-panel">
                    <div className="skeleton-category shimmer"></div>
                    <div className="skeleton-title-large shimmer"></div>
                    <div className="skeleton-price-row">
                        <div className="skeleton-price-large shimmer"></div>
                        <div className="skeleton-badge shimmer"></div>
                    </div>
                    <div className="skeleton-text shimmer"></div>
                    <div className="skeleton-text shimmer" style={{ width: '80%' }}></div>
                    <div className="skeleton-selection shimmer"></div>
                    <div className="skeleton-selection shimmer"></div>
                    <div className="skeleton-actions shimmer"></div>
                </div>
            </div>
        </div>
    );
};
