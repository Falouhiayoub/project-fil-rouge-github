import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart, selectCartItemsCount } from "../cartSlice";

describe('cartSlice', () => {
    const initialState = {
        items: [],
    };

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('should handle initial state', () => {
        const state = cartReducer(undefined, { type: 'unknown' });
        expect(state.items).toEqual([]);
    });

    it('should handle addToCart (new item)', () => {
        const product = { id: '1', name: 'Product 1', price: 100 };
        const action = addToCart(product);
        const state = cartReducer(initialState, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual({ ...product, quantity: 1 });

        // Verify localStorage
        expect(JSON.parse(localStorage.getItem('cart'))).toEqual(state.items);
    });

    it('should handle addToCart (existing item)', () => {
        const product = { id: '1', name: 'Product 1', price: 100 };
        const stateWithItem = {
            items: [{ ...product, quantity: 1 }]
        };
        const action = addToCart(product);
        const state = cartReducer(stateWithItem, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(2);
    });

    it('should handle removeFromCart', () => {
        const stateWithItems = {
            items: [
                { id: '1', name: 'Product 1', quantity: 2 },
                { id: '2', name: 'Product 2', quantity: 1 }
            ]
        };
        const action = removeFromCart('1');
        const state = cartReducer(stateWithItems, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe('2');
    });

    it('should handle updateQuantity', () => {
        const stateWithItem = {
            items: [{ id: '1', name: 'Product 1', quantity: 1 }]
        };
        const action = updateQuantity({ id: '1', quantity: 5 });
        const state = cartReducer(stateWithItem, action);

        expect(state.items[0].quantity).toBe(5);
    });

    it('should handle clearCart', () => {
        const stateWithItems = {
            items: [{ id: '1', name: 'Product 1', quantity: 1 }]
        };
        const action = clearCart();
        const state = cartReducer(stateWithItems, action);

        expect(state.items).toHaveLength(0);
        expect(localStorage.getItem('cart')).toBe("[]");
    });

    describe('selectors', () => {
        it('selectCartItemsCount should calculate total quantity', () => {
            const state = {
                cart: {
                    items: [
                        { id: '1', quantity: 2 },
                        { id: '2', quantity: 3 }
                    ]
                }
            };
            expect(selectCartItemsCount(state)).toBe(5);
        });

        it('selectCartItemsCount should return 0 for empty cart', () => {
            const state = {
                cart: {
                    items: []
                }
            };
            expect(selectCartItemsCount(state)).toBe(0);
        });
    });
});
