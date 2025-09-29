import { createSlice } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
    try {
        if (typeof window !== 'undefined') {
            const cart = localStorage.getItem('ecommerce-cart');
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
            localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
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
            if (!action.payload?.id) {
                state.error = 'Invalid product data';
                return;
            }

            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    ...action.payload,
                    quantity: 1
                });
            }
            state.error = null;
            saveCartToLocalStorage(state.items);
        },
        removeFromCart: (state, action) => {
            if (!action.payload) {
                state.error = 'Invalid product ID';
                return;
            }

            state.items = state.items.filter(item => item.id !== action.payload);
            state.error = null;
            saveCartToLocalStorage(state.items);
        },
        updateQuantity: (state, action) => {
            if (!action.payload?.id || action.payload?.quantity === undefined) {
                state.error = 'Invalid quantity update data';
                return;
            }

            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(0, action.payload.quantity);
                if (item.quantity === 0) {
                    state.items = state.items.filter(i => i.id !== action.payload.id);
                }
            }
            state.error = null;
            saveCartToLocalStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            state.error = null;
            saveCartToLocalStorage(state.items);
        },
        loadCart: (state) => {
            state.items = loadCartFromLocalStorage();
            state.error = null;
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
} = cartSlice.actions;

export default cartSlice.reducer;