const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';

export const login = createAsyncThunk('admin/loginAdmin', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    localStorage.setItem("admin_token", JSON.stringify(response.data.admin_token));
    console.log("adminSlice Response: ", response);
    return response;
});

export const orders = createAsyncThunk('admin/orders', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/orders';
    const send_data = {
        page: request_data.page
    }
    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const update_status = createAsyncThunk('admin/update_status', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/update-status';
    const send_data = {
        order_id: request_data.order_id,
        status: request_data.status
    }
    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    console.log("updateStatus Response: ", response);
    return response;
});

export const create_order = createAsyncThunk('admin/create_order', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/update-status';
    const send_data = {
        product_name: request_data.product_name,
        product_price: request_data.product_price,
        product_description: request_data.product_description,
        image_name: request_data.image_name,
        category_id: request_data.category_id
    }
    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    console.log("Create Order Response: ", response);
    return response;
});

const initialState = {
    admin: null,
    order: null,
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
                state.admin = null;
                state.error = action.payload?.message || "Login failed";
            }
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }).addCase(orders.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(orders.fulfilled, (state, action) => {
            state.loading = false;
            console.log(action.payload.code);
            if (action.payload?.code == 200) {
                state.order = action.payload.data;
                state.error = null;
            } else {
                state.admin = null;
                state.error = action.payload?.message || "Orders Fetch failed";
            }
        })
        .addCase(orders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        }).addCase(update_status.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(update_status.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload?.code == 200) {
                state.error = null;
            } else {
                state.error = action.payload?.message || "Status Update failed";
            }
        })
        .addCase(update_status.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }

});

export default adminSlice.reducer;