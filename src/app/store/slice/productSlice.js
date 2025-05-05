const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';

export const signup = createAsyncThunk('products/signupUser', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/signup';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const login = createAsyncThunk('products/loginUser', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const show_products = createAsyncThunk('products/showProds', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/products';

    console.log("Slice req token", token);

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("resp Show Products: ", response);
    return response;
});

export const get_product_by_id = createAsyncThunk('products/getProductById', async ({ id, token }) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/user/products/${id}`;

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("Response in ID: ", response);
    return response;
});

export const add_to_cart = createAsyncThunk('products/addToCart', async ({ product_id, qty, token }) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = `http://localhost:5000/v1/user/add-to-cart`;
    const data = {
        product_id: product_id,
        qty: qty
    }
    const response = await secureFetch(url, data, 'POST', api_key, token);
    console.log("Response in Add to Cart: ", response);
    return response;
});

export const get_cart_details = createAsyncThunk('products/getCartDetails', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/cart-details';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("Cart Details Response: ", response);
    return response;
});

export const get_delivery_address = createAsyncThunk('products/getDeliveryAddress', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/delivery-address';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("Delivery Address Response: ", response);
    return response;
});

export const place_order = createAsyncThunk('products/placeOrder', async ({ payment_type, address_id, token }) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/place-order';
    const request_data = {
        payment_type,
        address_id
    };

    const response = await secureFetch(url, request_data, 'POST', api_key, token);
    console.log("Place Order Response: ", response);
    return response;
});

export const get_user_info = createAsyncThunk('products/getUserInfo', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/info';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    console.log("User Info Response: ", response);
    return response;
});

export const logout = createAsyncThunk('products/logout', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/logout';
    const response = await secureFetch(url, {}, 'POST', api_key, token);
    console.log("User Logout Response: ", response);
    localStorage.removeItem('token');
    return response;
});

export const addAddress = createAsyncThunk('products/addAddress', async (data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/add-delivery-address';
    const data_address = {
        address_line: data.address_line,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: data.country
    }
    const response = await secureFetch(url, data_address, 'POST', api_key, data.token);
    console.log("User Add Address Response: ", response);
    return response;
});

export const get_categories = createAsyncThunk('products/getCategories', async (token) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/categories';

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    return response;
});

export const filter_products = createAsyncThunk('products/filterProducts', async (filtersToApply) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/filter';
    console.log("Here: ", filtersToApply);
    const filters = {
        search: filtersToApply.search.trim(),
        category:filtersToApply.category ? filtersToApply.category : [],
        max_price: filtersToApply.max_price ? Number(filtersToApply.max_price) : null,
        page: 1
    }

    const response = await secureFetch(url, filters, 'POST', api_key, filtersToApply.token);
    return response;
});

export const edit_profile = createAsyncThunk('products/editProfile', async (request_data) => {
    const api_key = "b77aa44e2f6b79a09835de8f4cc84dac";
    const url = 'http://localhost:5000/v1/user/edit';
    console.log("Here in edit profile: ", request_data);
    const send_data = {
        full_name: request_data.full_name,
        about: request_data.about,
        profile_picture: request_data.profile_picture
    }

    const response = await secureFetch(url, send_data, 'POST', api_key, request_data.token);
    return response;
});

const initialState = {
    user: null,
    token: null,
    prods: null,
    cart: null,
    cartItems: null,
    cuurentProd: null,
    deliveryAddresses: null,
    addedAddress: null,
    order: null,
    userInfo: null,
    categories: null,
    filters: {
        category: [],
        search: '',
        max_price: null,
        page: 1
    },
    filteredProds: null,
    error: null,
    loading: false,
};

const prodSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.order = null;
        },
        updateFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },
        resetFilters: (state) => {
            state.filters = {
                category: [],
                search: '',
                max_price: null,
                page: 1
            };
            state.filteredProds = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    state.error = null;
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload?.message || "Signup failed";
                }
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
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
            }).addCase(show_products.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(show_products.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.prods = action.payload.data;
                    state.error = null;
                } else {
                    state.prods = null;
                    state.error = action.payload?.message || "Login failed";
                }
            })
            .addCase(show_products.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(get_product_by_id.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_product_by_id.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.cuurentProd = action.payload.data;
                    state.error = null;
                } else {
                    state.cuurentProd = null;
                    state.error = action.payload?.message || "Product not found";
                }
            })
            .addCase(get_product_by_id.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(add_to_cart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(add_to_cart.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.cart = action.payload.data;
                    state.error = null;
                } else {
                    state.cart = null;
                    state.error = action.payload?.message || "Can not add to cart";
                }
            })
            .addCase(add_to_cart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(get_cart_details.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_cart_details.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.cartItems = action.payload.data;
                    state.error = null;
                } else {
                    state.cartItems = [];
                    state.error = action.payload?.message || "Failed to load cart details";
                }
            })
            .addCase(get_cart_details.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(get_delivery_address.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_delivery_address.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.deliveryAddresses = action.payload.data;
                    state.error = null;
                } else {
                    state.deliveryAddresses = [];
                    state.error = action.payload?.message || "Failed to load delivery addresses";
                }
            })
            .addCase(get_delivery_address.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(place_order.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(place_order.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.order = action.payload.data;
                    state.error = null;
                } else {
                    state.order = null;
                    state.error = action.payload?.message || "Failed to place order";
                }
            })
            .addCase(place_order.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(get_user_info.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_user_info.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code === 200) {
                    state.userInfo = action.payload.data;
                    state.error = null;
                } else {
                    state.userInfo = null;
                    state.error = action.payload?.message || "Failed to load user info";
                }
            })
            .addCase(get_user_info.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.order = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addedAddress = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(addAddress.rejected, (state, action) => {
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
            .addCase(filter_products.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(filter_products.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.filteredProds = action.payload.data;
                    state.error = null;
                } else {
                    state.filteredProds = null;
                    state.error = action.payload?.message || "No products found";
                }
            })
            .addCase(filter_products.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(edit_profile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(edit_profile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 200) {
                    state.error = null;
                } else {
                    state.error = action.payload?.message || "Error in Update Profile";
                }
            })
            .addCase(edit_profile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }

});

export const { resetOrder, updateFilters, resetFilters } = prodSlice.actions;
export default prodSlice.reducer;