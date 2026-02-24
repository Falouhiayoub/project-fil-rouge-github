import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../../context/ToastContext';
import productsReducer from '../../../redux/slices/productSlice';
import cartReducer from '../../../redux/slices/cartSlice';
import ChatBot from '../ChatBot';
import { getAIResponse } from '../../../services/chatbotService';

// Mock the chatbot service
jest.mock('../../../services/chatbotService', () => ({
    getAIResponse: jest.fn()
}));

const renderWithProviders = (component) => {
    const store = configureStore({
        reducer: {
            products: productsReducer,
            cart: cartReducer
        }
    });
    return render(
        <Provider store={store}>
            <ToastProvider>
                <MemoryRouter>
                    {component}
                </MemoryRouter>
            </ToastProvider>
        </Provider>
    );
};

describe('ChatBot', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock scrollIntoView as it's not implemented in JSDOM
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it('is closed by default', () => {
        renderWithProviders(<ChatBot />);
        expect(screen.queryByPlaceholderText(/ask for style tips/i)).not.toBeInTheDocument();
        expect(screen.getByLabelText('Open Chat')).toBeInTheDocument();
    });

    it('opens window when toggle button is clicked', () => {
        renderWithProviders(<ChatBot />);
        const toggle = screen.getByLabelText('Open Chat');
        fireEvent.click(toggle);

        expect(screen.getByText('Fashion Fuel')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/ask for style tips/i)).toBeInTheDocument();
    });

    it('closes window when close button is clicked', () => {
        renderWithProviders(<ChatBot />);
        fireEvent.click(screen.getByLabelText('Open Chat')); // Open
        fireEvent.click(screen.getByLabelText('Close Chat Window')); // Close

        expect(screen.queryByText('Fashion Fuel')).not.toBeInTheDocument();
    });

    it('sends a message and displays AI response', async () => {
        getAIResponse.mockResolvedValue('Hello from AI!');

        renderWithProviders(<ChatBot />);
        fireEvent.click(screen.getByLabelText('Open Chat')); // Open

        const input = screen.getByPlaceholderText(/ask for style tips/i);
        // Find button by its SVG or just by button type if it's the only one in the input area
        const sendBtn = screen.getByRole('button', { name: '' }); // The send button has no text, just an icon

        fireEvent.change(input, { target: { value: 'Hi AI' } });
        fireEvent.click(sendBtn);

        // Verify user message is shown
        expect(screen.getByText('Hi AI')).toBeInTheDocument();

        // Wait for AI response
        await waitFor(() => {
            expect(screen.getByText('Hello from AI!')).toBeInTheDocument();
        });

        expect(getAIResponse).toHaveBeenCalled();
    });

    it('handles Enter key to send message', async () => {
        getAIResponse.mockResolvedValue('Response from enter');
        renderWithProviders(<ChatBot />);
        fireEvent.click(screen.getByLabelText('Open Chat'));

        const input = screen.getByPlaceholderText(/ask for style tips/i);
        fireEvent.change(input, { target: { value: 'Trigger enter' } });

        // Use keyDown or keyPress with correct properties
        fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });

        await waitFor(() => {
            expect(screen.getByText('Trigger enter')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Response from enter')).toBeInTheDocument();
        });

        expect(getAIResponse).toHaveBeenCalled();
    });
});
