// This file centralizes environment variables to make them easier to mock in tests
// and to avoid parsing issues with import.meta.env in Jest.

export const VITE_N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
export const VITE_N8N_WEBHOOK_URL_CONTACT_PAGE = import.meta.env.VITE_N8N_WEBHOOK_URL_CONTACT_PAGE;
export const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
export const VITE_CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const VITE_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
export const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
