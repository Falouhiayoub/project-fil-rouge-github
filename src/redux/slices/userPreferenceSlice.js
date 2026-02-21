import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    recentlyViewedIds: JSON.parse(localStorage.getItem('recentlyViewed')) || [],
    favoriteCategories: JSON.parse(localStorage.getItem('favoriteCategories')) || {},
    interactionHistory: JSON.parse(localStorage.getItem('interactionHistory')) || [],
};

const userPreferenceSlice = createSlice({
    name: 'userPreference',
    initialState,
    reducers: {
        trackProductView: (state, action) => {
            const productId = action.payload.id;
            const category = action.payload.category;
            
            // Update recently viewed (max 10)
            state.recentlyViewedIds = [
                productId,
                ...state.recentlyViewedIds.filter(id => id !== productId)
            ].slice(0, 10);
            
            // Update favorite categories
            if (category) {
                state.favoriteCategories[category] = (state.favoriteCategories[category] || 0) + 1;
            }

            // Track interaction
            state.interactionHistory.push({
                type: 'view',
                productId,
                timestamp: Date.now()
            });

            localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewedIds));
            localStorage.setItem('favoriteCategories', JSON.stringify(state.favoriteCategories));
            localStorage.setItem('interactionHistory', JSON.stringify(state.interactionHistory.slice(-50)));
        },
        trackAddToCart: (state, action) => {
            const { id, category } = action.payload;
            
            state.interactionHistory.push({
                type: 'cart',
                productId: id,
                timestamp: Date.now()
            });

            if (category) {
                state.favoriteCategories[category] = (state.favoriteCategories[category] || 0) + 3; // Weight cart more
            }

            localStorage.setItem('favoriteCategories', JSON.stringify(state.favoriteCategories));
            localStorage.setItem('interactionHistory', JSON.stringify(state.interactionHistory.slice(-50)));
        }
    }
});

export const { trackProductView, trackAddToCart } = userPreferenceSlice.actions;
export default userPreferenceSlice.reducer;
