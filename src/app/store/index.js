"use client";

import { configureStore } from "@reduxjs/toolkit";
import prodReducer from "./slice/productSlice";
import adminReducer from "./slice/adminSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            products: prodReducer,
            admin: adminReducer
        },
    });
}