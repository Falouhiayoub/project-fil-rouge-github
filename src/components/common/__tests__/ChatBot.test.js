import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatBot from '../ChatBot';
import { getAIResponse } from '../../../services/chatbotService';

// Mock the chatbot service
jest.mock('../../../services/chatbotService', () => ({
    getAIResponse: jest.fn()
}));

describe('ChatBot', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock scrollIntoView as it's not implemented in JSDOM
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it('is closed by default', () => {
        render(<ChatBot />);
        expect(screen.queryByPlaceholderText(/ask me anything/i)).not.toBeInTheDocument();
        expect(screen.getByText('💬')).toBeInTheDocument();
    });

    it('opens window when toggle button is clicked', () => {
        render(<ChatBot />);
        const toggle = screen.getByText('💬');
        fireEvent.click(toggle);

        expect(screen.getByText('Fashion AI Fuel')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/ask me anything/i)).toBeInTheDocument();
    });

    it('closes window when close button is clicked', () => {
        render(<ChatBot />);
        fireEvent.click(screen.getByText('💬')); // Open
        fireEvent.click(screen.getByText('✕')); // Close

        expect(screen.queryByText('Fashion AI Fuel')).not.toBeInTheDocument();
    });

    it('sends a message and displays AI response', async () => {
        getAIResponse.mockResolvedValue('Hello from AI!');

        render(<ChatBot />);
        fireEvent.click(screen.getByText('💬')); // Open

        const input = screen.getByPlaceholderText(/ask me anything/i);
        const sendBtn = screen.getByText('➤');

        fireEvent.change(input, { target: { value: 'Hi AI' } });
        fireEvent.click(sendBtn);

        // Verify user message is shown
        expect(screen.getByText('Hi AI')).toBeInTheDocument();
        expect(screen.getByText('AI is thinking...')).toBeInTheDocument();

        // Wait for AI response
        await waitFor(() => {
            expect(screen.getByText('Hello from AI!')).toBeInTheDocument();
        });

        expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
        expect(getAIResponse).toHaveBeenCalledWith('Hi AI');
    });

    it('handles Enter key to send message', async () => {
        getAIResponse.mockResolvedValue('Response from enter');
        render(<ChatBot />);
        fireEvent.click(screen.getByText('💬'));

        const input = screen.getByPlaceholderText(/ask me anything/i);
        fireEvent.change(input, { target: { value: 'Trigger enter' } });

        // Use keyDown or keyPress with correct properties
        fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });

        await waitFor(() => {
            expect(screen.getByText('Trigger enter')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Response from enter')).toBeInTheDocument();
        });

        expect(getAIResponse).toHaveBeenCalledWith('Trigger enter');
    });
});
