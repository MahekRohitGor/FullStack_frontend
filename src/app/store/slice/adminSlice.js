const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';

export const login = createAsyncThunk('admin/loginAdmin', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    localStorage.setItem("admin_token", JSON.stringify(response.admin_token));
    return response;
});

const initialState = {
    admin: null,
    error: null,
    loading: false,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            console.log(action.payload.code);
            if (action.payload?.code == 200) {
                state.admin = action.payload.data.adminInfo;
                state.error = null;
            } else {
                state.user = null;
                state.token = null;
                state.error = action.payload?.message || "Login failed";
            }
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }

});

export const { resetOrder, updateFilters, resetFilters } = adminSlice.actions;
export default adminSlice.reducer;