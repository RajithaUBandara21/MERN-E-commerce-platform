import  { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";

import shopSearchSlice from "./shop/search-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,

        shopSearch: shopSearchSlice,
    }
    });

    export default store;