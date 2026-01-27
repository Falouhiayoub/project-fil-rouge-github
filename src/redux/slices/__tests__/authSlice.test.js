import authReducer, { login, logout } from "../authSlice";

describe('authSlice', () => {
    const initialState = {
        isAuthenticated: false,
        user: null,
        role: null,
    };

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('should handle initial state', () => {
        // We need to account for the fact that authSlice might load from localStorage on import
        // If localStorage is empty, it should be the same as initialState
        const state = authReducer(undefined, { type: 'unknown' });
        expect(state).toEqual(initialState);
    });

    it('should handle login', () => {
        const userData = { email: 'test@example.com', role: 'user' };
        const action = login(userData);
        const state = authReducer(initialState, action);

        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(userData);
        expect(state.role).toBe('user');

        // Verify localStorage persistence
        const savedAuth = JSON.parse(localStorage.getItem('auth'));
        expect(savedAuth).toEqual(state);
    });

    it('should handle logout', () => {
        const loggedInState = {
            isAuthenticated: true,
            user: { email: 'test@example.com', role: 'user' },
            role: 'user',
        };
        const action = logout();
        const state = authReducer(loggedInState, action);

        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.role).toBeNull();

        // Verify localStorage removal
        expect(localStorage.getItem('auth')).toBeNull();
    });
});
