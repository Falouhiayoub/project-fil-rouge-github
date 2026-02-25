import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../../context/ToastContext';
import cartReducer, { addToCart } from '../../../redux/slices/cartSlice';
import wishlistReducer from '../../../redux/slices/wishlistSlice';
import ProductCard from '../ProductCard';

// Simple mock for formatCurrency since it might have non-breaking spaces or different formatting in test env
jest.mock('../../../utils/formatCurrency', () => ({
    formatCurrency: (val) => `$${val}.00`
}));

const renderWithRedux = (
    component,
    { store = configureStore({ 
        reducer: { 
            cart: cartReducer,
            wishlist: wishlistReducer
        } 
    }) } = {}
) => {
    return {
        ...render(
            <Provider store={store}>
                <ToastProvider>
                    <MemoryRouter>
                        {component}
                    </MemoryRouter>
                </ToastProvider>
            </Provider>
        ),
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

        // Find the "Add to cart" button by its aria-label
        const addToCartButtons = screen.getAllByLabelText('Add to cart');
        // Click the first one (Quick Add)
        fireEvent.click(addToCartButtons[0]);

        // Verify Redux state updated instead of just spying on dispatch (more robust)
        expect(store.getState().cart.items).toHaveLength(1);
        expect(store.getState().cart.items[0].id).toBe('1');
        expect(store.getState().cart.items[0].quantity).toBe(1);
    });

    it('dispatches toggleWishlist action when wishlist button is clicked', () => {
        const { store } = renderWithRedux(<ProductCard product={mockProduct} />);

        const wishlistBtn = screen.getByLabelText('Add to wishlist');
        fireEvent.click(wishlistBtn);

        expect(store.getState().wishlist.items).toHaveLength(1);
        expect(store.getState().wishlist.items[0].id).toBe('1');
    });
});
