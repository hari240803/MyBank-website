import {configureStore} from "@reduxjs/toolkit";
import authenticationSlice from "./authentication-slice";

const store = configureStore({
    reducer: {authentication: authenticationSlice.reducer}
});

export default store;