import axios from 'axios';
import { VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET } from '../config/env';

const CLOUDINARY_CLOUD_NAME = VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = VITE_CLOUDINARY_UPLOAD_PRESET || 'fashion_hub_preset';

if (!CLOUDINARY_CLOUD_NAME) {
    console.error('❌ VITE_CLOUDINARY_CLOUD_NAME is not set in .env file');
}

if (!UPLOAD_PRESET) {
    console.error('❌ VITE_CLOUDINARY_UPLOAD_PRESET is not set in .env file');
}

/**
 * Uploads an image file to Cloudinary
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadImage = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error('Cloudinary cloud name is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file.');
    }

    if (!UPLOAD_PRESET) {
        throw new Error('Cloudinary upload preset is not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);

        if (error.response) {
            // The request was made and the server responded with a status code
            const status = error.response.status;
            const message = error.response.data?.error?.message || 'Unknown error';

            if (status === 401) {
                throw new Error(`Cloudinary authentication failed (401). Please check:\n1. Your cloud name is correct: "${CLOUDINARY_CLOUD_NAME}"\n2. The upload preset "${UPLOAD_PRESET}" exists in your Cloudinary dashboard\n3. The upload preset is set to "Unsigned" mode\n\nError: ${message}`);
            } else if (status === 400) {
                throw new Error(`Invalid upload request (400): ${message}`);
            } else {
                throw new Error(`Upload failed (${status}): ${message}`);
            }
        }

        throw new Error(`Network error: ${error.message}`);
    }
};
