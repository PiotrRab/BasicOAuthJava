import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { authenticated: false },
    reducers: {
        setAuthenticated: (state, action) => {
            state.authenticated = action.payload;
        }
    }
});

export const { setAuthenticated } = authSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
});

export default store;
