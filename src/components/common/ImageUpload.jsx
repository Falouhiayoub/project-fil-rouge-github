import React, { useState } from 'react';
import { uploadImage } from '../../services/cloudinaryService';

const ImageUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);
        setError(null);

        try {
            const uploadedUrl = await uploadImage(file);
            if (onUploadSuccess) {
                onUploadSuccess(uploadedUrl);
            }
        } catch (err) {
            setError('Failed to upload image. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload-container" style={{ margin: '1rem 0' }}>
            <label className="form-label">Upload Image</label>
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="form-input"
                disabled={uploading}
            />
            {uploading && <p>Uploading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {preview && (
                <div style={{ marginTop: '1rem' }}>
                    <p>Preview:</p>
                    <img src={preview} alt="Upload preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
