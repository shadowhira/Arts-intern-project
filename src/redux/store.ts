import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import searchSlice from './searchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;