import { createSlice } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
    try {
        if (typeof window !== 'undefined') {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        }
        return [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

const saveCartToLocalStorage = (cart) => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCartFromLocalStorage(),
        error: null,
    },
    reducers: {
        addToCart: (state, action) => {
            if (!action.payload?.id) return;

            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: 1
                });
            }
            saveCartToLocalStorage(state.items);
        },
        removeFromCart: (state, action) => {
            if (!action.payload) return;

            state.items = state.items.filter(item => item.id !== action.payload);
            saveCartToLocalStorage(state.items);
        },
        updateQuantity: (state, action) => {
            if (!action.payload?.id || action.payload?.quantity === undefined) return;

            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(0, action.payload.quantity);
                if (item.quantity === 0) {
                    state.items = state.items.filter(i => i.id !== action.payload.id);
                }
            }
            saveCartToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToLocalStorage(state.items);
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;