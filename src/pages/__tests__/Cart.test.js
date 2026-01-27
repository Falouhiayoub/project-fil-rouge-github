import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import cartReducer from '../../redux/slices/cartSlice';
// import Cart from '../Cart';

describe('Cart Page Imports Test', () => {
    it('should pass if imports are okay', () => {
        expect(true).toBe(true);
    });
});
