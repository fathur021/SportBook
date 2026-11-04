import { configureStore } from "@reduxjs/toolkit";
import adminApi from "./admin-api";

export const makeStore = () => configureStore({
    reducer: {
        [adminApi.reducerPath]:adminApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(adminApi.middleware)
})

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];