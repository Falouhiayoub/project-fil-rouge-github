import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import Fuse from 'fuse.js';

// Async thunks for products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        selectedProduct: null,
        loading: false,
        error: null,
        filteredItems: [],
        currentCategory: 'all',
        searchQuery: ''
    },
    reducers: {
        filterByCategory: (state, action) => {
            const category = action.payload;
            state.currentCategory = category;
            state.searchQuery = ''; // Clear search when category changes
            if (category === 'all') {
                state.filteredItems = state.items;
            } else {
                state.filteredItems = state.items.filter(item => item.category === category);
            }
        },
        setSearchQuery: (state, action) => {
            const query = action.payload;
            state.searchQuery = query;
            
            if (!query) {
                // If query is empty, respect the current category filter
                if (state.currentCategory === 'all') {
                    state.filteredItems = state.items;
                } else {
                    state.filteredItems = state.items.filter(item => item.category === state.currentCategory);
                }
                return;
            }

            // Fuzzy search setup
            const options = {
                keys: ['title', 'category', 'description'],
                threshold: 0.3, // Adjust for sensitivity (0.0 exact, 1.0 matches everything)
                includeScore: true
            };

            const sourceItems = state.currentCategory === 'all' 
                ? state.items 
                : state.items.filter(item => item.category === state.currentCategory);

            const fuse = new Fuse(sourceItems, options);
            const results = fuse.search(query);
            state.filteredItems = results.map(result => result.item);
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = action.payload; // Initialize filtered with all
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle fetchProductById
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { filterByCategory, setSearchQuery, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
