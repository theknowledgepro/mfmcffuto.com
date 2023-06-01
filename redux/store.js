import { createWrapper } from "next-redux-wrapper";
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers/index';

export const store = () => configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
});

export const wrapper = createWrapper(store);
