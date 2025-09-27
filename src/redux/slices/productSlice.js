import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create async thunk for fetching products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('https://fake-store-api.mock.beeceptor.com/api/products');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
        lastFetched: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        resetStatus: (state) => {
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.lastFetched = new Date().toISOString();
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch products';
            });
    },
});


export const { resetError, resetStatus } = productSlice.actions;

export default productSlice.reducer;
export const selectAllProducts = (state) => state.products.items;
export const selectProductById = (state, productId) =>
    state.products.items.find(product => product.id === productId);
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

// exporting of all the product slice and reducer