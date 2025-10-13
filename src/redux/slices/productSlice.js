import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch and normalize products so each item has `id`
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch('https://fake-store-api.mock.beeceptor.com/api/products');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            const normalized = Array.isArray(data)
                ? data.map(p => ({
                    ...p,
                    id: p.id ?? p.product_id ?? null,
                    availability: p.availability !== false && p.availability !== 'out of stock'
                }))
                : [];

            return normalized;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: { items: [], status: 'idle', error: null, lastFetched: null, searchQuery: '' },
    reducers: {
        resetError: state => { state.error = null; },
        resetStatus: state => { state.status = 'idle'; },
        setSearchQuery: (state, action) => { state.searchQuery = action.payload; }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProducts.pending, state => { state.status = 'loading'; state.error = null; })
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
    }
});

export const { resetError, resetStatus, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
