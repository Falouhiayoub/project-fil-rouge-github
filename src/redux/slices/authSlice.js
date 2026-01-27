import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null, // { email, role }
    role: null, // 'admin' | 'user'
};

// Check localStorage for persisted session (optional enhancement for later, keeping simple for now)
const savedAuth = localStorage.getItem('auth');
const preloadedState = savedAuth ? JSON.parse(savedAuth) : initialState;

const authSlice = createSlice({
    name: 'auth',
    initialState: preloadedState,
    reducers: {
        login: (state, action) => {
            const { email, role } = action.payload;
            state.isAuthenticated = true;
            state.user = { email, role };
            state.role = role;
            localStorage.setItem('auth', JSON.stringify(state));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
            localStorage.removeItem('auth');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
