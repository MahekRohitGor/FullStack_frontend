const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');
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

    console.log("Slice req Data", request_data);

    const response = await secureFetch(url, request_data, 'POST', api_key);
    console.log("resp login: ", response);
    return response;
});

const initialState = {
    user: null,
    token: null,
    error: null,
    loading: false,
};

const prodSlice = createSlice({
    name: 'products',
    initialState,
    reducers:{
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
        })
    }

});

export default prodSlice.reducer;