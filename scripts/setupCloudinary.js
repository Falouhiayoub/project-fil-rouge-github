import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const createPreset = async () => {
    try {
        const presetName = 'fashion_hub_preset';

        // Check if preset exists or just try to create/update

        try {
            const result = await cloudinary.api.create_upload_preset({
                name: presetName,
                unsigned: true,
                folder: 'fashion-hub',
                allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            });

            console.log(`Upload preset '${presetName}' created successfully.`);
            console.log(result);
        } catch (createError) {
            if (createError.error && createError.error.message && createError.error.message.includes('already exists')) {
                console.log("Preset already exists, updating...");
                try {
                    const result = await cloudinary.api.update_upload_preset(presetName, {
                        unsigned: true,
                        folder: 'fashion-hub',
                        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
                    });
                    console.log("Preset updated successfully.");
                } catch (updateError) {
                    console.error('Error updating upload preset:', updateError);
                }
            } else {
                throw createError;
            }
        }
    } catch (error) {
        console.error('Error creating upload preset:', error);
    }
};

createPreset();
