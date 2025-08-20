// store.js
import { configureStore } from '@reduxjs/toolkit';
import uploadReducer from './uploadSlice';
import breadcrumbReducer from './breadcrumbSlice';

export const store = configureStore({
  reducer: {
    upload: uploadReducer,
    breadcrumb: breadcrumbReducer,
  },
});