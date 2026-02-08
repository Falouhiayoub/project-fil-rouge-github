import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart } from '../../../redux/slices/cartSlice';
import ProductCard from '../ProductCard';

// Simple mock for formatCurrency since it might have non-breaking spaces or different formatting in test env
jest.mock('../../../utils/formatCurrency', () => ({
    formatCurrency: (val) => `$${val}.00`
}));

const renderWithRedux = (
    component,
    { store = configureStore({ reducer: { cart: cartReducer } }) } = {}
) => {
    return {
        ...render(<Provider store={store}>{component}</Provider>),
        store,
    };
};

describe('ProductCard', () => {
    const mockProduct = {
        id: '1',
        title: 'Test Product',
        price: 99,
        category: 'electronics',
        image: 'test-image.jpg'
    };

    it('renders product details correctly', () => {
        renderWithRedux(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('electronics')).toBeInTheDocument();
        expect(screen.getByText('$99.00')).toBeInTheDocument();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'test-image.jpg');
    });

    it('dispatches addToCart action when button is clicked', () => {
        const { store } = renderWithRedux(<ProductCard product={mockProduct} />);

        // Since we have two buttons (Quick Add and icon btn), we use getAllByRole
        const buttons = screen.getAllByRole('button', { name: /add to cart/i });
        fireEvent.click(buttons[0]);

        // Verify Redux state updated instead of just spying on dispatch (more robust)
        expect(store.getState().cart.items).toHaveLength(1);
        expect(store.getState().cart.items[0].id).toBe('1');
        expect(store.getState().cart.items[0].quantity).toBe(1);
    });
});
