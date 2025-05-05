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
    const url = 'http://localhost:5000/v1/admin/create-product';
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

export const get_categories = createAsyncThunk('products/getCategories', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/categories';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});


export const get_products = createAsyncThunk('products/get_products', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/products';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});

export const delete_products = createAsyncThunk('products/delete_products', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/delete-product';
    const send_data = {
        product_id: request_data.product_id
    }
    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const edit_products = createAsyncThunk('products/edit_products', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/edit-prod';

    console.log(request_data);

    const send_data = {
        product_id: request_data.product_id,
        product_name: request_data.product_name,
        product_description: request_data.product_description,
        product_price: request_data.product_price
    }

    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

export const get_users = createAsyncThunk('products/get_users', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/admin/users';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});

export const edit_user = createAsyncThunk('products/edit_user', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/admin/update-profile/${request_data.user_id}`;

    console.log(request_data);

    const send_data = {
        full_name: request_data.full_name,
        profile_pic: request_data.profile_pic,
        about: request_data.about,
        is_active: request_data.is_active,
        email_id: request_data.email_id
    }

    const response = await secureFetch(url, send_data, 'PUT', api_key, request_data.token);
    return response;
});

const initialState = {
    admin: null,
    order: null,
    created_order: null,
    categories: null,
    products: null,
    users: null,
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
            }).addCase(create_order.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(create_order.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.created_order = action.payload.data;
                    state.error = null;
                } else {
                    state.created_order = null;
                    state.error = action.payload?.message || "Status Update failed";
                }
            })
            .addCase(create_order.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(get_categories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_categories.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.categories = action.payload.data;
                    state.error = null;
                } else {
                    state.categories = null;
                    state.error = action.payload?.message || "Failed to load categories";
                }
            })
            .addCase(get_categories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(get_products.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(get_products.fulfilled, (state, action) => {
              state.loading = false;
              if (action.payload?.code == 200) {
                state.products = action.payload.data;
                state.error = null;
              } else {
                state.products = null;
                state.error = action.payload?.message || "Failed to load products";
              }
            })
            .addCase(get_products.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            })
            .addCase(delete_products.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(delete_products.fulfilled, (state, action) => {
              state.loading = false;
              if (action.payload?.code == 200) {
                state.error = null;
              } else {
                state.error = action.payload?.message || "Failed to delete product";
              }
            })
            .addCase(delete_products.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            })
            .addCase(edit_products.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(edit_products.fulfilled, (state, action) => {
              state.loading = false;
              if (action.payload?.code == 200) {
                state.error = null;
              } else {
                state.error = action.payload?.message || "Failed to update product";
              }
            })
            .addCase(edit_products.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
            }).addCase(get_users.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(get_users.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                  state.users = action.payload.data;
                  state.error = null;
                } else {
                  state.users = null;
                  state.error = action.payload?.message || "Failed to get user";
                }
              })
              .addCase(get_users.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              })
              .addCase(edit_user.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(edit_user.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                  state.error = null;
                } else {
                  state.error = action.payload?.message || "Failed to update user";
                }
              })
              .addCase(edit_user.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              })
    }

});

export default adminSlice.reducer;