import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('./src/config/env', () => ({
    VITE_N8N_WEBHOOK_URL: 'http://mock-webhook.com',
    VITE_N8N_WEBHOOK_URL_CONTACT_PAGE: 'http://mock-contact-webhook.com',
    VITE_GEMINI_API_KEY: 'mock-api-key',
    VITE_CLOUDINARY_CLOUD_NAME: 'mock-cloud',
    VITE_CLOUDINARY_UPLOAD_PRESET: 'mock-preset'
}));
