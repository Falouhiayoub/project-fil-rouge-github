import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import cartReducer from '../../redux/slices/cartSlice';
import Checkout from '../Checkout';
import * as api from '../../services/api';
import axios from 'axios';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock dependencies
jest.mock('../../services/api');
jest.mock('axios');
jest.mock('../../components/features/checkout/CheckoutForm', () => {
    return function MockCheckoutForm({ onSubmit }) {
        return (
            <button
                data-testid="mock-submit"
                onClick={() => onSubmit({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    address: '123 St',
                    city: 'NY',
                    zip: '10001'
                })}
            >
                Submit Order
            </button>
        );
    };
});

const renderWithReduxAndRouter = (
    component,
    { store = configureStore({ reducer: { cart: cartReducer } }) } = {}
) => {
    return {
        ...render(
            <Provider store={store}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </Provider>
        ),
        store,
    };
};

describe('Checkout Page', () => {
    const mockItems = [{ id: '1', title: 'Product 1', price: 100, quantity: 1 }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('redirects to cart if cart is empty', () => {
        renderWithReduxAndRouter(<Checkout />);
        expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('renders checkout form and order summary when items are present', () => {
        const store = configureStore({
            reducer: { cart: cartReducer },
            preloadedState: { cart: { items: mockItems } }
        });

        renderWithReduxAndRouter(<Checkout />, { store });

        expect(screen.getByText(/order summary/i)).toBeInTheDocument();
        expect(screen.getByText(/product 1 \(x1\)/i)).toBeInTheDocument();
        expect(screen.getByTestId('mock-submit')).toBeInTheDocument();
    });

    it('handles order placement successfully', async () => {
        api.createOrder.mockResolvedValue({ id: 'order-123' });
        axios.post.mockResolvedValue({ data: 'success' });

        const store = configureStore({
            reducer: { cart: cartReducer },
            preloadedState: { cart: { items: mockItems } }
        });

        renderWithReduxAndRouter(<Checkout />, { store });

        const submitBtn = screen.getByTestId('mock-submit');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(api.createOrder).toHaveBeenCalled();
        });

        expect(screen.getByText(/thank you for your purchase/i)).toBeInTheDocument();
        expect(store.getState().cart.items).toHaveLength(0);
    });

    it('shows error if order placement fails', async () => {
        api.createOrder.mockRejectedValue(new Error('API Error'));
        window.alert = jest.fn();

        const store = configureStore({
            reducer: { cart: cartReducer },
            preloadedState: { cart: { items: mockItems } }
        });

        renderWithReduxAndRouter(<Checkout />, { store });

        fireEvent.click(screen.getByTestId('mock-submit'));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('error placing your order'));
        });
    });
});
