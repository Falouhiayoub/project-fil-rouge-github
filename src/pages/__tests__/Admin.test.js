import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import authReducer, { logout } from '../../redux/slices/authSlice';
import Admin from '../Admin';

// Mock child components
jest.mock('../../components/admin/DashboardOverview', () => () => <div data-testid="overview">Overview View</div>);
jest.mock('../../components/admin/ProductList', () => () => <div data-testid="products">Products View</div>);
jest.mock('../../components/admin/OrderList', () => () => <div data-testid="orders">Orders View</div>);

const renderWithReduxAndRouter = (
    component,
    { store = configureStore({ reducer: { auth: authReducer } }) } = {}
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

describe('Admin Page', () => {
    const adminState = {
        auth: {
            isAuthenticated: true,
            user: { email: 'admin@test.com', role: 'admin' },
            role: 'admin'
        }
    };

    it('redirects to home if not authenticated or not admin', () => {
        // Redirection logic in component: if (!isAuthenticated || role !== 'admin') return <Navigate to="/" replace />;
        const { container } = renderWithReduxAndRouter(<Admin />);
        expect(container.firstChild).toBeNull();
    });

    it('renders admin dashboard for authenticated admins', () => {
        const store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: adminState
        });

        renderWithReduxAndRouter(<Admin />, { store });

        expect(screen.getByText(/fashion fuel admin/i)).toBeInTheDocument();
        expect(screen.getByTestId('overview')).toBeInTheDocument();
    });

    it('switches views when sidebar items are clicked', () => {
        const store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: adminState
        });

        renderWithReduxAndRouter(<Admin />, { store });

        // Click Products
        fireEvent.click(screen.getByText(/products/i));
        expect(screen.getByTestId('products')).toBeInTheDocument();
        expect(screen.queryByTestId('overview')).not.toBeInTheDocument();

        // Click Orders
        fireEvent.click(screen.getByText(/commands \(orders\)/i));
        expect(screen.getByTestId('orders')).toBeInTheDocument();
    });

    it('dispatches logout and redirects when logout button is clicked', () => {
        const store = configureStore({
            reducer: { auth: authReducer },
            preloadedState: adminState
        });

        renderWithReduxAndRouter(<Admin />, { store });

        const logoutBtn = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutBtn);

        expect(store.getState().auth.isAuthenticated).toBe(false);
    });
});
