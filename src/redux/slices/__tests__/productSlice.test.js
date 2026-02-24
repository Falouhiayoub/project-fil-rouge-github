import productsReducer, { fetchProducts, filterByCategory } from "../productSlice";

describe('productSlice', () => {
    const initialState = {
        items: [],
        selectedProduct: null,
        loading: false,
        error: null,
        filteredItems: [],
        currentCategory: 'all',
        searchQuery: ''
    };

    it('should handle initial state', () => {
        expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle fetchProducts.pending', () => {
        const action = { type: fetchProducts.pending.type };
        const state = productsReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle fetchProducts.fulfilled', () => {
        const products = [
            { id: '1', name: 'Product 1', category: 'electronics' },
            { id: '2', name: 'Product 2', category: 'clothing' }
        ];
        const action = { type: fetchProducts.fulfilled.type, payload: products };
        const state = productsReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.items).toEqual(products);
        expect(state.filteredItems).toEqual(products);
    });

    it('should handle fetchProducts.rejected', () => {
        const error = 'Failed to fetch';
        const action = { type: fetchProducts.rejected.type, payload: error };
        const state = productsReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });

    it('should handle filterByCategory', () => {
        const products = [
            { id: '1', name: 'Product 1', category: 'electronics' },
            { id: '2', name: 'Product 2', category: 'clothing' }
        ];
        const stateWithProducts = {
            ...initialState,
            items: products,
            filteredItems: products
        };

        // Filter by electronics
        const action = filterByCategory('electronics');
        const state = productsReducer(stateWithProducts, action);

        expect(state.currentCategory).toBe('electronics');
        expect(state.filteredItems).toHaveLength(1);
        expect(state.filteredItems[0].category).toBe('electronics');

        // Filter by all
        const actionAll = filterByCategory('all');
        const stateAll = productsReducer(state, actionAll);
        expect(stateAll.currentCategory).toBe('all');
        expect(stateAll.filteredItems).toEqual(products);
    });
});
